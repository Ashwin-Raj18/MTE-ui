import { Component, OnInit } from "@angular/core";
import { SonarService } from "app/services/sonar.service";
import { Table } from "primeng/table";

@Component({
  selector: "app-sonarqube",
  templateUrl: "./sonarqube.component.html",
  styleUrls: ["./sonarqube.component.scss"],
})
export class SonarqubeComponent implements OnInit {
  projects = [];
  metrics = [];
  issues = [];
  selectedProject :any;
  loadingIssues : boolean = true;
  data: { labels: string[]; datasets: { label: string; backgroundColor: string; borderColor: string; pointBackgroundColor: string; pointBorderColor: string; pointHoverBackgroundColor: string; pointHoverBorderColor: string; data: number[]; }[]; };
  chartOptions: { plugins: { legend: { labels: { color: string; }; }; }; scales: { r: { pointLabels: { color: string; }; grid: { color: string; }; angleLines: { color: string; }; }; }; };
  hotspotsTableData: any;
  constructor(private sonarService: SonarService) {}

  ngOnInit(): void {

  this.data = {
      labels: [],
      datasets: [
          {
              label: 'Sonar Metric Data',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              pointBackgroundColor: 'rgba(255,99,132,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(255,99,132,1)',
              data: []
          }
      ]
  };
  this.chartOptions = this.getLightTheme();
  this.getProjects();
  }


  getLightTheme() {
    return {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            r: {
                pointLabels: {
                    color: '#495057',
                },
                grid: {
                    color: '#ebedef',
                },
                angleLines: {
                    color: '#ebedef'
                }
            }
        }
    }
}

  getProjects() {
    this.sonarService.getSonarProjects().subscribe(
      (response) => {
        this.projects = response;
        this.projects.sort()
        this.selectedProject = this.projects[0]
        this.getByProject();  
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getByProject() {
    this.getChartData();
    this.getIssuesByProject();
    this.getHotspotsByProject();
  }

  getIssuesByProject() {
    this.loadingIssues = true;
    this.issues = []
    this.sonarService.getIssues(this.selectedProject).subscribe(
      (response) => {
        this.issues = response.issues;    
      },
      (error) => {
        console.log(error);
      }
    );
    this.loadingIssues = false;

  }

  getChartData(){
    this.sonarService.getMetrics(this.selectedProject).subscribe((response) => {
      let labels = [];
      let values = [];
      response.measures?.forEach((item, index) => {
        if(!(item.metric == 'development cost' || item.metric == 'ncloc' || item.metric == 'cognitive complexity')){
          labels.push(item.metric + ' : ' + item.value)
          values.push(item.value)
        }
      })
      this.data.labels = labels;
      this.data.datasets[0].data =values;
      this.data =  {...this.data }
    },
    (error) => {
      console.log(error);
    }
  );
  }

  getHotspotsByProject() {
    this.loadingIssues = true;
    this.issues = []
    this.sonarService.getHotSpots(this.selectedProject).subscribe(
      (response) => {
        this.hotspotsTableData = response.hotspots;
      },
      (error) => {
        console.log(error);
      }
    );
    this.loadingIssues = false;

  }
}
