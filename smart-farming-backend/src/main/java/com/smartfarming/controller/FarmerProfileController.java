package com.smartfarming.controller;

import com.smartfarming.dto.farmer.FarmerProfileRequest;
import com.smartfarming.dto.farmer.FarmerProfileResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.FarmerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;

    @GetMapping("/me")
    public ResponseEntity<FarmerProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(farmerProfileService.getProfile(user));
    }

    @PutMapping("/me")
    public ResponseEntity<FarmerProfileResponse> updateMyProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody FarmerProfileRequest request) {
        return ResponseEntity.ok(farmerProfileService.updateProfile(user, request));
    }
}
