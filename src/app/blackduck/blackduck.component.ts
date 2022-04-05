import { Component, OnInit, ViewChild } from "@angular/core";
import { BlackduckService } from "app/services/blackduck.service";
import zingchart from "zingchart/es6";
import { Table } from "primeng/table";
import { UIChart } from "primeng/chart";

@Component({
  selector: "app-blackduck",
  templateUrl: "./blackduck.component.html",
  styleUrls: ["./blackduck.component.scss"],
})
export class BlackduckComponent implements OnInit {
  componentTableData = [];
  securityTableData = [];
  projects = [];
  selectedProject: any;

  @ViewChild("dt") table: Table;
  @ViewChild("dt2") table2: Table;


  loading: boolean = true;
  loadingSecurity: boolean = true;

  chartOptions: {
    plugins: { legend: { labels: { color: string } } };
    scales: { r: { grid: { color: string } } };
  };

  secuityChartData = {
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#26C6DA",
        ],
        label: "My dataset",
      },
    ],
    labels: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
  };
  licenseChartData = {
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#26C6DA",
        ],
        label: "My dataset",
      },
    ],
    labels: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
  };
  operationChartData = {
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          "#42A5F5",
          "#66BB6A",
          "#FFA726",
          "#26C6DA",
        ],
        label: "My dataset",
      },
    ],
    labels: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
  };
 
  constructor(private bdService: BlackduckService) {}

  ngOnInit(): void {
    this.chartOptions = this.getLightTheme();

    this.bdService.getBDProjects().subscribe(
      (allProjects) => {
        this.projects = allProjects;
        this.selectedProject = this.projects[0]
        this.getByProject();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getByProject() {
    this.secuityChartData.datasets[0].data = [0, 0, 0, 0] ;
    this.operationChartData.datasets[0].data = [0, 0, 0, 0] ;
    this.licenseChartData.datasets[0].data = [0, 0, 0, 0] ;

    this.getVersionDetails();
    this.getbdComponentByProject();
    this.getbdSecurityByProject();
  }

  getbdSecurityByProject() {
    this.bdService.bdSecurityByProject(this.selectedProject).subscribe(
      (componentData) => {
        this.mapEachSecurityToTableData(componentData);
        console.log(this.securityTableData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getbdComponentByProject() {
    this.bdService.bdComponentByProject(this.selectedProject ).subscribe(
      (componentData) => {
        this.mapEachcomponentToTableData(componentData);
        console.log(this.componentTableData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  mapEachcomponentToTableData(componentData: any) {
    this.loading = true;
    let items = componentData[0].component.items;
    this.componentTableData = [];
    items.forEach((item, index) => {
      let rowData: any = {};
      rowData = {
        componentName: item.componentName,
        usage: item.usages[0] || "",
        license: item.licenses[0].licenseDisplay,
        securityRiskProfile: this.getMaxRiskCount(item.securityRiskProfile),
        licenseRiskProfile: this.getMaxRiskCount(item.licenseRiskProfile),
      };
      this.componentTableData.push(rowData);
    });
    this.loading = false;
  }

  mapEachSecurityToTableData(securityData: any) {
    this.loadingSecurity = true;
    let items = securityData[0].vul.items;
    this.securityTableData = [];
    items.forEach((item, index) => {
      let rowData: any = {};
      rowData = {
        componentName: item.componentName,
        componentVersionName: item.componentVersionName,
        componentVersionOriginId: item.componentVersionOriginId,
        componentVersionOriginName: item.componentVersionOriginName,
        riskPriorityDistribution: item.riskPriorityDistribution,
      };
      this.securityTableData.push(rowData);
    });
    this.loadingSecurity = false;
  }

  getMaxRiskCount(riskData) {
    let max = 0;
    let returnData = "NONE";
    riskData.counts.forEach((d, index) => {
      if (d.count > max) {
        max = d.count;
        returnData = d.countType;
      }
    });
    return returnData;
  }

  getVersionDetails() {
    this.bdService.getBdMetricsByProject(this.selectedProject).subscribe(
      (data) => {
        console.log(data);
        this.generateRiskProfileChartData(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: "#ebedef",
          },
        },
      },
    };
  }

  generateRiskProfileChartData(data) {
    let versionData = data.versions.items[0];

    //generate for security risk profile chart
    let countData = [];
    let lableData = [];
    versionData.securityRiskProfile.counts.forEach((i) => {
      if(!(i.countType == 'OK' || i.countType == 'UNKNOWN' )){
        countData.push(i.count);
        lableData.push(i.countType + " : " +i.count )
      }
    });
    this.secuityChartData.datasets[0].data = countData;
    this.secuityChartData.labels = lableData;
    this.secuityChartData =  {...this.secuityChartData }

    //generate for operation risk profile chart
    countData = [];
    lableData = [];
    versionData.operationalRiskProfile.counts.forEach((i) => {
      if(!(i.countType == 'OK' || i.countType == 'UNKNOWN' )){
        countData.push(i.count);
        lableData.push(i.countType + " : " +i.count )
      }
    });
    this.operationChartData.datasets[0].data = countData;
    this.operationChartData.labels = lableData;
    this.operationChartData =  {...this.operationChartData }

    //generate for license risk profile chart
    countData = [];
    lableData = [];
    versionData.licenseRiskProfile.counts.forEach((i) => {
      if(!(i.countType == 'OK' || i.countType == 'UNKNOWN' )){
        countData.push(i.count);
        lableData.push(i.countType + " : " +i.count )
      }
    });
    this.licenseChartData.datasets[0].data = countData;
    this.licenseChartData.labels = lableData;
    this.licenseChartData =  {...this.licenseChartData }
  }
}
