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
  constructor(private sonarService: SonarService) {}

  ngOnInit(): void {
    this.getProjects();
    
  }

  getProjects() {
    this.sonarService.getSonarProjects().subscribe(
      (response) => {
        this.projects = response;
        this.selectedProject = this.projects[0]
        this.getByProject();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getByProject() {
    this.getIssuesByProject();
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
}
