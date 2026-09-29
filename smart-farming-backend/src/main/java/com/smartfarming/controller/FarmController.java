package com.smartfarming.controller;

import com.smartfarming.dto.farm.FarmRequest;
import com.smartfarming.dto.farm.FarmResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.FarmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    public ResponseEntity<FarmResponse> createFarm(
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody FarmRequest request) {
        return new ResponseEntity<>(farmService.createFarm(user, request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FarmResponse>> getMyFarms(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(farmService.getMyFarms(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmResponse> getFarmById(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(farmService.getFarmById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmResponse> updateFarm(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody FarmRequest request) {
        return ResponseEntity.ok(farmService.updateFarm(id, user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        farmService.deleteFarm(id, user);
        return ResponseEntity.noContent().build();
    }
}
