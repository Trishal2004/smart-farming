package com.smartfarming.service;

import com.smartfarming.dto.season.ProfitSummaryResponse;
import com.smartfarming.entity.Expense;
import com.smartfarming.entity.Harvest;
import com.smartfarming.entity.User;
import com.smartfarming.repository.ExpenseRepository;
import com.smartfarming.repository.HarvestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfitService {

    private final ExpenseRepository expenseRepository;
    private final HarvestRepository harvestRepository;
    private final SeasonService seasonService;

    public ProfitSummaryResponse getProfitSummary(Long seasonId, User user) {
        seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user); // Security verification

        List<Expense> expenses = expenseRepository.findBySeasonId(seasonId);
        List<Harvest> harvests = harvestRepository.findBySeasonId(seasonId);

        Double totalInvestment = expenses.stream()
                .mapToDouble(e -> e.getTotalInvestment() != null ? e.getTotalInvestment() : 0.0)
                .sum();

        Double totalIncome = harvests.stream()
                .mapToDouble(h -> h.getTotalIncome() != null ? h.getTotalIncome() : 0.0)
                .sum();

        Double profit = totalIncome - totalInvestment;
        Double profitMargin = 0.0;

        if (totalIncome > 0) {
            profitMargin = (profit / totalIncome) * 100;
        } else if (totalInvestment > 0) {
            profitMargin = -100.0; // If they invested but made 0 income, 100% loss.
        }

        return ProfitSummaryResponse.builder()
                .totalInvestment(totalInvestment)
                .totalIncome(totalIncome)
                .profit(profit)
                .profitMargin(profitMargin)
                .build();
    }
}
