import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TalentProfileService } from "../../services/talent-profile.service";

describe("TalentProfileService", () => {
  let service: TalentProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TalentProfileService],
    });

    service = TestBed.inject(TalentProfileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
