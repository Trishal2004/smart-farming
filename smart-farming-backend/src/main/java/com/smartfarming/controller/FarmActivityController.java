package com.smartfarming.controller;

import com.smartfarming.dto.diary.FarmActivityRequest;
import com.smartfarming.dto.diary.FarmActivityResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.FarmActivityService;
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
public class FarmActivityController {

    private final FarmActivityService activityService;

    @PostMapping("/seasons/{seasonId}/activities")
    public ResponseEntity<FarmActivityResponse> createActivity(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody FarmActivityRequest request) {
        return new ResponseEntity<>(activityService.createActivity(seasonId, user, request), HttpStatus.CREATED);
    }

    @GetMapping("/seasons/{seasonId}/activities")
    public ResponseEntity<List<FarmActivityResponse>> getActivitiesBySeasonId(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(activityService.getActivitiesBySeasonId(seasonId, user));
    }

    @GetMapping("/activities/{id}")
    public ResponseEntity<FarmActivityResponse> getActivityById(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(activityService.getActivityById(id, user));
    }

    @PutMapping("/activities/{id}")
    public ResponseEntity<FarmActivityResponse> updateActivity(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody FarmActivityRequest request) {
        return ResponseEntity.ok(activityService.updateActivity(id, user, request));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        activityService.deleteActivity(id, user);
        return ResponseEntity.noContent().build();
    }
}
