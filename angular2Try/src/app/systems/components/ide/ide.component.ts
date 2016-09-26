import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit {
  projectName = "mCloudIDE";
  constructor() { }

  ngOnInit() {
  }

}
