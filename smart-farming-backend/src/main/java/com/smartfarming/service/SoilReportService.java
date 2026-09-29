package com.smartfarming.service;

import com.smartfarming.dto.soil.SoilReportRequest;
import com.smartfarming.dto.soil.SoilReportResponse;
import com.smartfarming.entity.Season;
import com.smartfarming.entity.SoilReport;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.exception.UnauthorizedAccessException;
import com.smartfarming.repository.SoilReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoilReportService {

    private final SoilReportRepository soilReportRepository;
    private final SeasonService seasonService;

    public SoilReportResponse createSoilReport(Long seasonId, User user, SoilReportRequest request) {
        Season season = seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);

        SoilReport report = SoilReport.builder()
                .season(season)
                .nitrogen(request.getNitrogen())
                .phosphorus(request.getPhosphorus())
                .potassium(request.getPotassium())
                .phLevel(request.getPhLevel())
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .rainfall(request.getRainfall())
                .build();

        report = soilReportRepository.save(report);
        return mapToResponse(report);
    }

    public List<SoilReportResponse> getSoilReportsBySeasonId(Long seasonId, User user) {
        seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);
        return soilReportRepository.findBySeasonId(seasonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SoilReport getSoilReportEntityAndVerifyOwnership(Long id, User user) {
        SoilReport report = soilReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soil report not found"));

        if (!report.getSeason().getFarm().getFarmerProfile().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this soil report");
        }
        return report;
    }

    public SoilReportResponse getSoilReportById(Long id, User user) {
        SoilReport report = getSoilReportEntityAndVerifyOwnership(id, user);
        return mapToResponse(report);
    }

    public SoilReportResponse updateSoilReport(Long id, User user, SoilReportRequest request) {
        SoilReport report = getSoilReportEntityAndVerifyOwnership(id, user);

        report.setNitrogen(request.getNitrogen());
        report.setPhosphorus(request.getPhosphorus());
        report.setPotassium(request.getPotassium());
        report.setPhLevel(request.getPhLevel());
        report.setTemperature(request.getTemperature());
        report.setHumidity(request.getHumidity());
        report.setRainfall(request.getRainfall());

        report = soilReportRepository.save(report);
        return mapToResponse(report);
    }

    public void deleteSoilReport(Long id, User user) {
        SoilReport report = getSoilReportEntityAndVerifyOwnership(id, user);
        soilReportRepository.delete(report);
    }

    private SoilReportResponse mapToResponse(SoilReport report) {
        return SoilReportResponse.builder()
                .id(report.getId())
                .seasonId(report.getSeason().getId())
                .nitrogen(report.getNitrogen())
                .phosphorus(report.getPhosphorus())
                .potassium(report.getPotassium())
                .phLevel(report.getPhLevel())
                .temperature(report.getTemperature())
                .humidity(report.getHumidity())
                .rainfall(report.getRainfall())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
