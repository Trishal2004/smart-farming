package com.smartfarming.controller;

import com.smartfarming.dto.soil.SoilReportRequest;
import com.smartfarming.dto.soil.SoilReportResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.SoilReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SoilReportController {

    private final SoilReportService soilReportService;

    @PostMapping("/seasons/{seasonId}/soil-reports")
    public ResponseEntity<SoilReportResponse> createSoilReport(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody SoilReportRequest request) {
        return new ResponseEntity<>(soilReportService.createSoilReport(seasonId, user, request), HttpStatus.CREATED);
    }

    @GetMapping("/seasons/{seasonId}/soil-reports")
    public ResponseEntity<List<SoilReportResponse>> getSoilReportsBySeasonId(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(soilReportService.getSoilReportsBySeasonId(seasonId, user));
    }

    @GetMapping("/soil-reports/{id}")
    public ResponseEntity<SoilReportResponse> getSoilReportById(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(soilReportService.getSoilReportById(id, user));
    }

    @PutMapping("/soil-reports/{id}")
    public ResponseEntity<SoilReportResponse> updateSoilReport(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody SoilReportRequest request) {
        return ResponseEntity.ok(soilReportService.updateSoilReport(id, user, request));
    }

    @DeleteMapping("/soil-reports/{id}")
    public ResponseEntity<Void> deleteSoilReport(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        soilReportService.deleteSoilReport(id, user);
        return ResponseEntity.noContent().build();
    }
}
