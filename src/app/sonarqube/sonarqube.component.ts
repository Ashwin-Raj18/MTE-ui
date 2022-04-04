import { Component, OnInit } from "@angular/core";
import { SonarService } from "app/services/sonar.service";

@Component({
  selector: "app-sonarqube",
  templateUrl: "./sonarqube.component.html",
  styleUrls: ["./sonarqube.component.scss"],
})
export class SonarqubeComponent implements OnInit {
  projects = [];
  metrics = [];

  constructor(private sonarService: SonarService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.sonarService.getSonarProjects().subscribe(
      (response) => {
        this.projects = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
