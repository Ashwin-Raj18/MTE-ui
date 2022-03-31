import { Component, OnInit } from '@angular/core';
import { JiraService } from 'app/services/jira.service';

@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrls: ['./jira.component.scss']
})
export class JiraComponent implements OnInit {

  sprints = [];
  projects = [];
  selectedProject = '';
  selectedSprint = '';
  jiraData = {
    bugs: [],
    stories: [],
    tasks: []
  };

  constructor(
    private jiraService: JiraService
  ) { }

  ngOnInit(): void {
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
    this.jiraService.getMetricsBySprint('arta-api', 'MTE Sprint 3').subscribe(
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
