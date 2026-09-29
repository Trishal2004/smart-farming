package com.smartfarming.controller;

import com.smartfarming.dto.season.SeasonRequest;
import com.smartfarming.dto.season.SeasonResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.SeasonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seasons")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonService seasonService;

    @PostMapping("/farm/{farmId}")
    public ResponseEntity<SeasonResponse> createSeason(
            @PathVariable Long farmId, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody SeasonRequest request) {
        return new ResponseEntity<>(seasonService.createSeason(farmId, user, request), HttpStatus.CREATED);
    }

    @GetMapping("/farm/{farmId}")
    public ResponseEntity<List<SeasonResponse>> getSeasonsByFarmId(
            @PathVariable Long farmId, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(seasonService.getSeasonsByFarmId(farmId, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeasonResponse> getSeasonById(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(seasonService.getSeasonById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeasonResponse> updateSeason(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody SeasonRequest request) {
        return ResponseEntity.ok(seasonService.updateSeason(id, user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeason(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        seasonService.deleteSeason(id, user);
        return ResponseEntity.noContent().build();
    }
}
