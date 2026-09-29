package com.smartfarming.controller;

import com.smartfarming.dto.expense.ExpenseRequest;
import com.smartfarming.dto.expense.ExpenseResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.ExpenseService;
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
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping("/seasons/{seasonId}/expenses")
    public ResponseEntity<ExpenseResponse> createExpense(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody ExpenseRequest request) {
        return new ResponseEntity<>(expenseService.createExpense(seasonId, user, request), HttpStatus.CREATED);
    }

    @GetMapping("/seasons/{seasonId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpensesBySeasonId(
            @PathVariable Long seasonId, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.getExpensesBySeasonId(seasonId, user));
    }

    @GetMapping("/expenses/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(expenseService.getExpenseById(id, user));
    }

    @PutMapping("/expenses/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user, 
            @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, user, request));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id, 
            @AuthenticationPrincipal User user) {
        expenseService.deleteExpense(id, user);
        return ResponseEntity.noContent().build();
    }
}
