import { Component, OnInit } from '@angular/core';
import { SonarService } from 'app/services/sonar.service';
import * as Chartist from 'chartist';
import "zingchart/modules-es6/zingchart-maps.min.js";
import "zingchart/modules-es6/zingchart-maps-usa.min.js";
import zingchart from 'zingchart/es6';
import { COLORS } from 'app/models/colors.model';
import { BlackduckService } from 'app/services/blackduck.service';
import { JiraService } from 'app/services/jira.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  myConfig = {
    "type": "ring",
    "plot": {
      "tooltip": { //Standard Tooltips
        "text": "%t",
        "padding": "10%",
        "border-radius": "5px"
      }
    },
    globals: {
      fontFamily: 'CorpoS',
      fontSize: 14,
      fontWeight: 'normal',
    },
    series: []
  };
  bdChartConfig = {
    "type": "bar",
    "plotarea": {
        "margin": "dynamic"
    },
    "plot": {   
        "bars-space-left":0.15,
        "bars-space-right":0.15,
        "animation": {
            "effect": "ANIMATION_SLIDE_BOTTOM",
            "sequence": 0, 
            "speed": 800,
            "delay": 800
        }
    },
    "scale-y": {
        "item": {
            "font-color": "#7e7e7e"
        },
    },
    "scaleX":{
        "values": [
            "License Risk",
            "Operational Risk",
            "Security Risk",
        ],
        "placement":"default",
        "tick":{
            "size":58,
            "placement":"cross"
        },
        "itemsOverlap":true,
        "item":{
            "offsetY":-55
        }
    },
    "crosshair-x":{
        "line-width":"100%",
        "alpha":0.18,
        "plot-label":{
          "header-text":"%kv Sales"
        }
    },
    "series": [
        {
            "values": [
            ],
            "borderRadiusTopLeft": 7,
            "alpha": 0.95,
            "background-color": "orange",
            "text": "Low"
        },
        {
            "values": [
            ],
            "borderRadiusTopLeft": 7,
            "alpha": 0.95,
            "background-color": "teal",
            "text": "Medium"
        },
        {
            "values": [
            ],
            "borderRadiusTopLeft": 7,
            "alpha": 0.95,
            "background-color": "red",
            "text": "High"
        }
    ]
};

jiraChartConfig = {
  "type": "nestedpie",
  "plot": {
    "slice-start": "35%"
  },
  "series": [{
      "values": [59, 55, 30]
    },
    {
      "values": [60, 50, 35]
    },
    {
      "values": [50, 40, 30]
    }
  ]
};

g1: any;
g2: any;
g3: any;
g4: any;

sonarChartConfig = {
  layout: 'horizontal', // Layout ring charts horizontally
  graphset: [],
}; 


  projects = [];
  bdMetrics: any;
  jiraData: any;

  constructor(
    private sonarService: SonarService,
    private blackDuckService: BlackduckService,
    private jiraService: JiraService
  ) {
   }
  
  ngOnInit() {
    this.loadSonarData();
  }

  loadSonarData() {
    this.sonarService.getSonarProjects().subscribe(
        (data) => {
          this.projects = data;
          this.getByMetrics();
          this.getBdMetrics();
          this.getJiraData();
        },
        (error) => {
            console.log(error);
    });
  }

  getByMetrics() {
    this.sonarService.getMetrics().subscribe(
        (data) => {
          // data.measures.forEach((d, index) => {
          //   let obj = {
          //     text: d.metric,
          //     values: [d.value],
          //     backgroundColor: COLORS[index]
          //   };
          //   this.myConfig.series.push(obj);
          // });
          this.g1 = this.graph('#1EBAED', 'Participation', [5, 2]);
          this.g2 = this.graph('#29CB6C', 'Goals met', [3, 4]);
          this.g3 = this.graph('#E7183D', 'Blocked', [0, 7]);
          this.g4 = this.graph('#5352ED', 'Mood', [1, 7], '7.1/10');
          this.sonarChartConfig.graphset = [this.g1, this.g2, this.g3, this.g4];
          zingchart.render({
            id : "sonarChart",
            height: 400, 
            width: '100%',
            data : this.sonarChartConfig,
          });
        },
        (error) => {
            console.log(error);
    });
  }

  getBdMetrics() {
    this.blackDuckService.getBdMetricsByProject().subscribe(
      (data) => {
        this.bdMetrics = data.versions.items[0];
        let risks = ['LOW', 'MEDIUM', 'HIGH'];
        risks.forEach((d, index) => {
          this.bdChartConfig.series[index].values.push(this.bdMetrics.licenseRiskProfile.counts.find(e => e.countType == d).count);
          this.bdChartConfig.series[index].values.push(this.bdMetrics.operationalRiskProfile.counts.find(e => e.countType == d).count);
          this.bdChartConfig.series[index].values.push(this.bdMetrics.securityRiskProfile.counts.find(e => e.countType == d).count);
        });
        zingchart.render({ 
          id : 'versiondata', 
          data : this.bdChartConfig, 
          height: 400, 
          width: '100%' 
        });
        },
        (error) => {
            console.log(error);
    });
  }

  getJiraData() {
    this.jiraService.getJiraData().subscribe(
      (data) => {
        this.jiraData = data;
        zingchart.render({
          id: 'jiraTasksChart',
          data: this.jiraChartConfig,
          height: 400,
          width: "100%"
        });
        },
        (error) => {
            console.log(error);
    });
  }

  graph(color, label, data, value?) {
    return {
      type : 'ring',
      backgroundColor : '#fff',
      plotarea : {
        // Margin around each ring chart
        margin : '0 50'
      },
      plot : {
        slice : '80%',  // Ring width,
        detach: false,  // Prevent ring piece from detaching on click
        valueBox: [
          {
            // Percentage text
            type: 'first',
            text: value,
            connected: false,
            fontColor: color,
            fontSize: '14px',
            placement: 'center',
            visible: true,
            offsetY: '-65px',
          },
          {
            // Label text
            type: 'first',
            text: label,
            connected: false,
            fontColor: '#718096',
            fontSize: '20px',
            placement: 'center',
            visible: true,
            offsetY: '-25px',
          }
        ],
      },
      scaleR : {
        // Set to half ring
        refAngle : 180,
        aperture : 180
      },
      tooltip: {
        // Hide tooltip
        visible: false
      },
      series : [
        {
          // First part of the ring (colored)
          values : [data[0]],
          backgroundColor : color,
        },
        {
          // Remainder of ring
          values : [data[1]],
          backgroundColor : '#EDF2F7',
        }
      ]
    };
  };

}
