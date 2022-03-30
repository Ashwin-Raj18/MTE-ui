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

  selectedProject = 'arta-ui';
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
    globals: {
      fontFamily: 'CorpoS',
      fontSize: 14,
      fontWeight: 'normal',
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
          "header-text":"%kv"
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
  title: {
    text: "Issue Type",
    'font-size': 14
  },
  globals: {
    fontFamily: 'CorpoS',
    fontSize: 14,
    fontWeight: 'normal',
  },
  "plot": {
    "slice-start": "50%",
    "tooltip": { //Standard Tooltips
      "text": "%v %t",
      "padding": "10%",
      "border-radius": "5px"
    }
  },
  "series": [{
      "values": [],
      "text": "Bug",
      "background-color": "red",
    },
    {
      "values": [],
      "text": "Story",
      "background-color": "teal",
    },
    {
      "values": [],
      "text": "Task",
      "background-color": "blue",
    }
  ]
};
jiraStatusChartConfig = {
  "type": "nestedpie",
  title: {
    text: "Status",
    'font-size': 14
  },
  globals: {
    fontFamily: 'CorpoS',
    fontSize: 14,
    fontWeight: 'normal',
  },
  "plot": {
    "slice-start": "50%",
    "tooltip": { //Standard Tooltips
      "text": "%v %t",
      "padding": "10%",
      "border-radius": "5px"
    }
  },
  "series": [{
      "values": [],
      "text": "To Do",
      "background-color": "purple",
    },
    {
      "values": [],
      "text": "In Progress",
      "background-color": "orange",
    },
    {
      "values": [],
      "text": "Testing",
      "background-color": "blue",
    },
    {
      "values": [],
      "text": "Done",
      "background-color": "green",
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
          this.getByProject(this.selectedProject);        
        },
        (error) => {
            console.log(error);
    });
  }

  getByMetrics() {
    this.sonarService.getMetrics(this.selectedProject).subscribe(
        (data) => {
          let bugs = parseInt(data.measures.find(e => e.metric == 'bugs').value);
          let code_smells = parseInt(data.measures.find(e => e.metric == 'code smells').value);
          let hotspots = parseInt(data.measures.find(e => e.metric == 'security hotspots').value);
          let vulnerabilities = parseInt(data.measures.find(e => e.metric == 'vulnerabilities').value);
          this.g1 = this.graph('#F03A13', 'Bugs', [bugs, Math.floor(Math.random() * (bugs - 1) + 1)], bugs);
          this.g2 = this.graph('#E6B323', 'Code Smells', [code_smells,Math.floor(Math.random() * (code_smells - 1) + 1)], code_smells);
          this.g3 = this.graph('#8614DA', 'Vulnerabilities', [hotspots, Math.floor(Math.random() * (hotspots - 1) + 1)], hotspots);
          this.g4 = this.graph('#9D5597', 'Security Hotspots', [vulnerabilities, Math.floor(Math.random() * (vulnerabilities - 1) + 1)], vulnerabilities);
          this.sonarChartConfig.graphset = [this.g1, this.g2, this.g3, this.g4];
          zingchart.render({
            id : "sonarChart",
            height: 200, 
            width: '100%',
            data : this.sonarChartConfig,
          });
        },
        (error) => {
            console.log(error);
    });
  }

  getBdMetrics() {
    this.blackDuckService.getBdMetricsByProject(this.selectedProject).subscribe(
      (data) => {
        this.bdMetrics = data.versions.items[0];
        let risks = ['LOW', 'MEDIUM', 'HIGH'];
        risks.forEach((d, index) => {
          this.bdChartConfig.series[index].values.push(this.bdMetrics.licenseRiskProfile.counts.find(e => e.countType == d).count);
          this.bdChartConfig.series[index].values.push(this.bdMetrics.operationalRiskProfile.counts.find(e => e.countType == d).count);
          this.bdChartConfig.series[index].values.push(this.bdMetrics.securityRiskProfile.counts.find(e => e.countType == d).count);
        });
        zingchart.render({ 
          id : 'bdMetricsChart', 
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
    this.jiraService.getJiraData(this.selectedProject).subscribe(
      (data) => {
        this.jiraData = data;
        this.jiraChartConfig.series[0].values = [this.jiraData.issueType.Bug];
        this.jiraChartConfig.series[1].values = [this.jiraData.issueType.Story];
        this.jiraChartConfig.series[2].values = [this.jiraData.issueType.Task];
        this.jiraStatusChartConfig.series[0].values = [this.jiraData.status['To Do']];
        this.jiraStatusChartConfig.series[1].values = [this.jiraData.status['In Progress']];
        this.jiraStatusChartConfig.series[2].values = [this.jiraData.status['Testing']];
        this.jiraStatusChartConfig.series[3].values = [this.jiraData.status['Done']];
        console.log(this.jiraStatusChartConfig);
        zingchart.render({
          id: 'jiraTasksChart',
          data: this.jiraChartConfig,
          height: 400,
          width: "100%"
        });
        zingchart.render({
          id: 'jiraStatusChartConfig',
          data: this.jiraStatusChartConfig,
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
      globals: {
        fontFamily: 'CorpoS',
        fontSize: 14,
        fontWeight: 'normal',
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
            offsetY: '-45px',
          },
          {
            // Label text
            type: 'first',
            text: label,
            connected: false,
            fontColor: '#718096',
            fontSize: '14px',
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
  }

  getByProject(project) {
    this.selectedProject = project;
    this.getByMetrics();
    this.getBdMetrics();
    this.getJiraData();
  }

}
