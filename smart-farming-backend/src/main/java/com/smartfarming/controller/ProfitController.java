package com.smartfarming.controller;

import com.smartfarming.dto.season.ProfitSummaryResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.ProfitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seasons/{seasonId}/profit")
@RequiredArgsConstructor
public class ProfitController {

    private final ProfitService profitService;

    @GetMapping
    public ResponseEntity<ProfitSummaryResponse> getProfitSummary(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profitService.getProfitSummary(seasonId, user));
    }
}
