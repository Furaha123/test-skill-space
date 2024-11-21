import { Component } from "@angular/core";
import { EducationRecord } from "../../models/education.record.interface";

@Component({
  selector: "app-talent-education",
  templateUrl: "./talent-education.component.html",
  styleUrls: ["./talent-education.component.scss"],
})
export class TalentEducationComponent {
  educationRecords: EducationRecord[] = [
    {
      degree: "BSc. Computer Science",
      institution: "University of Rwanda, Kigali",
      address: "KG 17 Ave, Kigali, Rwanda",
      country: "Rwanda",
      qualification: "Bachelor's Degree",
      status: "Graduated",
      startDate: "2014-09-01",
      endDate: "2018-06-30",
      filesCount: 2,
      files: [
        {
          name: "Sample PDF 1",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 2",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
      ],
    },
    {
      degree: "MSc. Information Technology",
      institution: "Carnegie Mellon University Africa, Kigali",
      address: "Kacyiru, Kigali, Rwanda",
      country: "Rwanda",
      qualification: "Master's Degree",
      status: "Graduated",
      startDate: "2018-09-01",
      endDate: "2020-05-30",
      filesCount: 3,
      files: [
        {
          name: "Sample PDF 1",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 2",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 3",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
      ],
    },
    {
      degree: "BSc. Software Engineering",
      institution: "African Leadership University, Kigali",
      address: "Nyarutarama, Kigali, Rwanda",
      country: "Rwanda",
      qualification: "Bachelor's Degree",
      status: "Graduated",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      filesCount: 2,
      files: [
        {
          name: "Sample PDF 1",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 2",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
      ],
    },
    {
      degree: "Certificate in Cybersecurity",
      institution: "Rwanda Coding Academy, Nyabihu",
      address: "Nyabihu District, Rwanda",
      country: "Rwanda",
      qualification: "Certificate",
      status: "Completed",
      startDate: "2021-01-15",
      endDate: "2021-12-20",
      filesCount: 2,
      files: [
        {
          name: "Sample PDF 1",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 2",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
      ],
    },
    {
      degree: "BSc. Information Systems",
      institution: "Mount Kenya University, Kigali Campus",
      address: "Kigali, Rwanda",
      country: "Rwanda",
      qualification: "Bachelor's Degree",
      status: "Graduated",
      startDate: "2016-09-01",
      endDate: "2020-06-30",
      filesCount: 3,
      files: [
        {
          name: "Sample PDF 1",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 2",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
        {
          name: "Sample PDF 3",
          url: "https://img.yumpu.com/24823037/1/500x640/sample-pdf.jpg",
        },
      ],
    },
  ];

  showUpdateComponent = false;
  selectedRecord: EducationRecord | null = null;

  mode: "add" | "update" = "add";

  startAddNewRecord(): void {
    this.mode = "add";
    this.selectedRecord = {
      degree: "",
      institution: "",
      address: "",
      country: "",
      qualification: "",
      status: "",
      startDate: "",
      endDate: "",
      filesCount: 0,
      files: [],
    };
    this.showUpdateComponent = true;
  }

  startUpdate(record: EducationRecord): void {
    this.mode = "update";
    this.selectedRecord = { ...record };
    this.showUpdateComponent = true;
  }

  closeUpdateComponent(): void {
    this.showUpdateComponent = false;
    this.selectedRecord = null;
  }
}
