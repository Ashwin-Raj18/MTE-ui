import { Component, OnInit, ViewChild } from '@angular/core';
import { BlackduckService } from 'app/services/blackduck.service';
import zingchart from 'zingchart/es6';
import { Table } from 'primeng/table';


@Component({
    selector: 'app-blackduck',
    templateUrl: './blackduck.component.html',
    styleUrls: ['./blackduck.component.scss']
})
export class BlackduckComponent implements OnInit {

    componentTableData = [];
    securityTableData = [];

    @ViewChild('dt') table: Table;
    @ViewChild('dt2') table2: Table;
    loading: boolean = true;
    loadingSecurity: boolean = true;
    bdVersionGraphConfig =
        {
            "type": "bar",
            "background-color": "white",
            "title": {
                "text": "BlackDuck Scan Data",
                "font-color": "#7E7E7E",
                "backgroundColor": "none",
                "font-size": "22px",
                "alpha": 1,
                "adjust-layout": true
            },
            "plotarea": {
                "margin": "dynamic"
            },
            "legend": {
                "layout": "x3",
                "overflow": "page",
                "alpha": 0.05,
                "shadow": false,
                "align": "center",
                "adjust-layout": true,
                "marker": {
                    "type": "circle",
                    "border-color": "none",
                    "size": "10px"
                },
                "border-width": 0,
                "maxItems": 5,
                "toggle-action": "hide",
                "pageOn": {
                    "backgroundColor": "#000",
                    "size": "10px",
                    "alpha": 0.65
                },
                "pageOff": {
                    "backgroundColor": "#7E7E7E",
                    "size": "10px",
                    "alpha": 0.65
                },
                "pageStatus": {
                    "color": "black"
                }
            },
            "plot": {
                "bars-space-left": 0.15,
                "bars-space-right": 0.15,
                "animation": {
                    "effect": "ANIMATION_SLIDE_BOTTOM",
                    "sequence": 0,
                    "speed": 800,
                    "delay": 800
                }
            },
            "scale-y": {
                "line-color": "#7E7E7E",
                "item": {
                    "font-color": "#7e7e7e"
                },

                "guide": {
                    "visible": true
                },
                "label": {
                    "text": "Risk Count",
                    "font-family": "arial",
                    "bold": true,
                    "font-size": "14px",
                    "font-color": "#7E7E7E"
                }
            },
            "scaleX": {
                "values": [
                    "license Risk",
                    "Opeartion Risk",
                    "Security Risk"
                ],
                "placement": "default",
                "tick": {
                    "size": 58,
                    "placement": "cross"
                },
                "itemsOverlap": true,
                "item": {
                    "offsetY": -55
                }
            },
            "tooltip": {
                "visible": false
            },
            "crosshair-x": {
                "line-width": "100%",
                "alpha": 0.18,
                "plot-label": {
                    "header-text": "%kv "
                }
            },
            "series": [
                {
                    "values": [
                        0,
                        0,
                        0
                    ],
                    "alpha": 0.95,
                    "borderRadiusTopLeft": 7,
                    "background-color": "purple",
                    "text": "Critical"
                },
                {
                    "values": [
                        0,
                        0,
                        0
                    ],
                    "borderRadiusTopLeft": 7,
                    "alpha": 0.95,
                    "background-color": "orange",
                    "text": "High"
                },
                {
                    "values": [
                        0,
                        0,
                        0
                    ],
                    "alpha": 0.95,
                    "borderRadiusTopLeft": 7,
                    "background-color": "teal",
                    "text": "Medium"
                },
                {
                    "values": [
                        0,
                        0,
                        0
                    ],
                    "borderRadiusTopLeft": 7,
                    "alpha": 0.95,
                    "background-color": "red",
                    "text": "Low"
                },
                {
                    "values": [
                        0,
                        0,
                        0
                    ],
                    "borderRadiusTopLeft": 7,
                    "alpha": 0.95,
                    "background-color": "blue",
                    "text": "Ok"
                }
            ]
        }

    chartOptions: { plugins: { legend: { labels: { color: string; }; }; }; scales: { r: { grid: { color: string; }; }; }; };

    secuityChartData = {
        datasets: [{
            data: [
                0,
                0,
                0,
                0,
                0
            ],
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26C6DA",
                "#7E57C2"
            ],
            label: 'My dataset'
        }],
        labels: [
            "CRITICAL",
            "HIGH",
            "MEDIUM",
            "LOW",
            "OK"
        ]
    };
    licenseChartData = {
        datasets: [{
            data: [
                0,
                0,
                0,
                0,
                0
            ],
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26C6DA",
                "#7E57C2"
            ],
            label: 'My dataset'
        }],
        labels: [
            "CRITICAL",
            "HIGH",
            "MEDIUM",
            "LOW",
            "OK"
        ]
    };
    operationChartData = {
        datasets: [{
            data: [
                0,
                0,
                0,
                0,
                0
            ],
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26C6DA",
                "#7E57C2"
            ],
            label: 'My dataset'
        }],
        labels: [
            "CRITICAL",
            "HIGH",
            "MEDIUM",
            "LOW",
            "OK"
        ]
    };

    constructor(
        private bdService: BlackduckService
    ) { }

    ngOnInit(): void {
        this.chartOptions = this.getLightTheme()
        this.getVersionDetails()
        this.getbdComponentByProject()
        this.getbdSecurityByProject()
      
    }
    getbdSecurityByProject() {
        this.bdService.bdSecurityByProject('arta-api').subscribe(
            (componentData) => {
                this.mapEachSecurityToTableData(componentData)
                console.log(this.securityTableData)
            },
            (error) => {
                console.log(error);
            });
    }


    getbdComponentByProject() {
        this.bdService.bdComponentByProject('arta-api').subscribe(
            (componentData) => {
                this.mapEachcomponentToTableData(componentData)
                console.log(this.componentTableData)
            },
            (error) => {
                console.log(error);
            });
    }

    mapEachcomponentToTableData(componentData: any) {
        this.loading = true;
        let items = componentData[0].component.items;
        this.componentTableData = [];
        items.forEach((item, index) => {
            let rowData: any = {}
            rowData = {
                componentName: item.componentName,
                usage: item.usages[0] || '',
                license: item.licenses[0].licenseDisplay,
                securityRiskProfile: this.getMaxRiskCount(item.securityRiskProfile),
                licenseRiskProfile: this.getMaxRiskCount(item.licenseRiskProfile)
            }
            this.componentTableData.push(rowData);
        });
        this.loading = false;
    }
    mapEachSecurityToTableData(securityData: any) {
        this.loadingSecurity = true;
        let items = securityData[0].vul.items;
        this.securityTableData = [];
        items.forEach((item, index) => {
            let rowData: any = {}
            rowData = {
                componentName : item.componentName,
                componentVersionName: item.componentVersionName,
                componentVersionOriginId: item.componentVersionOriginId,
                componentVersionOriginName: item.componentVersionOriginName ,
                riskPriorityDistribution : item.riskPriorityDistribution,
            }
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
       
            this.bdService.getBdMetricsByProject('arta-api').subscribe(
                (data) => {
                    console.log(data)
                    this.mapEachVersionToChartData(data)
                    this.generateRiskProfileChartData(data)
                },
                (error) => {
                    console.log(error);
                });
        
    }

    mapEachVersionToChartData(data) {
        let versionData = data.versions.items[0];

        let risks = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'OK'];
        risks.forEach((d, index) => {
            this.bdVersionGraphConfig.series[index].values = this.getCountArray(versionData, d)
        });

        console.log(this.bdVersionGraphConfig)

        zingchart.render({
            id: 'versiondata',
            data: this.bdVersionGraphConfig,
            height: 300,
            width: '90%'
        });

    }
    //get all critical values
    getCountArray(versionData, type): number[] {

        let countArray = []

        let licenseRiskProfileCount = versionData.licenseRiskProfile.counts.find(i => {
            if (i.countType == type) {
                return i.count;
            }
        })
        let operationalRiskProfileCount = versionData.operationalRiskProfile.counts.find(i => {
            if (i.countType == type) {
                return i.count;
            }
        })
        let securityRiskProfileCount = versionData.securityRiskProfile.counts.find(i => {
            if (i.countType == type) {
                return i.count;
            }
        })

        countArray.push(licenseRiskProfileCount ? licenseRiskProfileCount.count : 0)
        countArray.push(operationalRiskProfileCount ? operationalRiskProfileCount.count : 0)
        countArray.push(securityRiskProfileCount ? securityRiskProfileCount.count : 0)
        return countArray;

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
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        }
    }

    generateRiskProfileChartData(data) {
        let versionData = data.versions.items[0];

        //generate for security risk profile chart
        let countData = [];
        versionData.securityRiskProfile.counts.forEach(i => {
            countData.push(i.count)
        })
        this.secuityChartData.datasets[0].data = countData;

        //generate for operation risk profile chart
        countData = [];
        versionData.operationalRiskProfile.counts.forEach(i => {
            countData.push(i.count)
        })
        this.operationChartData.datasets[0].data = countData;

        //generate for license risk profile chart
        countData = [];
        versionData.licenseRiskProfile.counts.forEach(i => {
            countData.push(i.count)
        })
        this.licenseChartData.datasets[0].data = countData;
    }

}



