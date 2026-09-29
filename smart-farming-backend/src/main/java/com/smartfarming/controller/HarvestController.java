package com.smartfarming.controller;

import com.smartfarming.dto.harvest.HarvestRequest;
import com.smartfarming.dto.harvest.HarvestResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.HarvestService;
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
public class HarvestController {

    private final HarvestService harvestService;

    @PostMapping("/seasons/{seasonId}/harvests")
    public ResponseEntity<HarvestResponse> createHarvest(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody HarvestRequest request) {
        return new ResponseEntity<>(harvestService.createHarvest(seasonId, user, request), HttpStatus.CREATED);
    }

    @GetMapping("/seasons/{seasonId}/harvests")
    public ResponseEntity<List<HarvestResponse>> getHarvestsBySeasonId(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(harvestService.getHarvestsBySeasonId(seasonId, user));
    }

    @GetMapping("/harvests/{id}")
    public ResponseEntity<HarvestResponse> getHarvestById(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(harvestService.getHarvestById(id, user));
    }

    @PutMapping("/harvests/{id}")
    public ResponseEntity<HarvestResponse> updateHarvest(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody HarvestRequest request) {
        return ResponseEntity.ok(harvestService.updateHarvest(id, user, request));
    }

    @DeleteMapping("/harvests/{id}")
    public ResponseEntity<Void> deleteHarvest(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        harvestService.deleteHarvest(id, user);
        return ResponseEntity.noContent().build();
    }
}
