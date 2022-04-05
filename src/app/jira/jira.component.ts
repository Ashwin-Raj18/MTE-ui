import { Component, OnInit } from '@angular/core';
import { JiraService } from 'app/services/jira.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrls: ['./jira.component.scss']
})
export class JiraComponent implements OnInit {

  sprints = [];
  projects = [];
  selectedProject = 'arta-api';
  selectedSprint = 'MTE-Sprint-2';
  jiraData = {
    bugs: [],
    stories: [],
    tasks: []
  };

  constructor(
    private jiraService: JiraService,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getSprints();
    this.getProjects();
    this.getProjectData();
  }

  getSprints() {
    this.jiraService.getSprints('arta-api').subscribe(
      (data) => {
        this.sprints = data;        
      },
      (error) => {
          console.log(error);
    });
  }

  getProjects() {
    this.jiraService.getProjects().subscribe(
      (data) => {
        this.projects = data;         
      },
      (error) => {
          console.log(error);
    });
  }

  getProjectData() {
    this.jiraService.getMetricsBySprint(this.selectedProject, this.selectedSprint).subscribe(
      (data) => {
        this.jiraData.bugs = data.filter(d => {if (d.fields.issuetype.name == 'Bug') return d});   
        this.jiraData.stories = data.filter(d => {if (d.fields.issuetype.name == 'Story')return d});  
        this.jiraData.tasks = data.filter(d => {if (d.fields.issuetype.name == 'Task') return d});   
      },
      (error) => {
          console.log(error);
    });
  }

}
