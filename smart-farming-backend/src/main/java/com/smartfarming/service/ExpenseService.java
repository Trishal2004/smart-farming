package com.smartfarming.service;

import com.smartfarming.dto.expense.ExpenseRequest;
import com.smartfarming.dto.expense.ExpenseResponse;
import com.smartfarming.entity.Expense;
import com.smartfarming.entity.Season;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.exception.UnauthorizedAccessException;
import com.smartfarming.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final SeasonService seasonService;

    private Double calculateTotalInvestment(ExpenseRequest request) {
        return request.getSeedCost() +
               request.getFertilizerCost() +
               request.getLabourCost() +
               request.getIrrigationCost() +
               request.getElectricityCost() +
               request.getTransportCost() +
               request.getPesticideCost() +
               request.getOtherExpenses();
    }

    public ExpenseResponse createExpense(Long seasonId, User user, ExpenseRequest request) {
        Season season = seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);
        
        Double totalInvestment = calculateTotalInvestment(request);

        Expense expense = Expense.builder()
                .season(season)
                .seedCost(request.getSeedCost())
                .fertilizerCost(request.getFertilizerCost())
                .labourCost(request.getLabourCost())
                .irrigationCost(request.getIrrigationCost())
                .electricityCost(request.getElectricityCost())
                .transportCost(request.getTransportCost())
                .pesticideCost(request.getPesticideCost())
                .otherExpenses(request.getOtherExpenses())
                .totalInvestment(totalInvestment)
                .build();

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getExpensesBySeasonId(Long seasonId, User user) {
        seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);
        return expenseRepository.findBySeasonId(seasonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Expense getExpenseEntityAndVerifyOwnership(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found"));

        if (!expense.getSeason().getFarm().getFarmerProfile().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this expense record");
        }
        return expense;
    }

    public ExpenseResponse getExpenseById(Long id, User user) {
        Expense expense = getExpenseEntityAndVerifyOwnership(id, user);
        return mapToResponse(expense);
    }

    public ExpenseResponse updateExpense(Long id, User user, ExpenseRequest request) {
        Expense expense = getExpenseEntityAndVerifyOwnership(id, user);

        expense.setSeedCost(request.getSeedCost());
        expense.setFertilizerCost(request.getFertilizerCost());
        expense.setLabourCost(request.getLabourCost());
        expense.setIrrigationCost(request.getIrrigationCost());
        expense.setElectricityCost(request.getElectricityCost());
        expense.setTransportCost(request.getTransportCost());
        expense.setPesticideCost(request.getPesticideCost());
        expense.setOtherExpenses(request.getOtherExpenses());
        
        expense.setTotalInvestment(calculateTotalInvestment(request));

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public void deleteExpense(Long id, User user) {
        Expense expense = getExpenseEntityAndVerifyOwnership(id, user);
        expenseRepository.delete(expense);
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .seasonId(expense.getSeason().getId())
                .seedCost(expense.getSeedCost())
                .fertilizerCost(expense.getFertilizerCost())
                .labourCost(expense.getLabourCost())
                .irrigationCost(expense.getIrrigationCost())
                .electricityCost(expense.getElectricityCost())
                .transportCost(expense.getTransportCost())
                .pesticideCost(expense.getPesticideCost())
                .otherExpenses(expense.getOtherExpenses())
                .totalInvestment(expense.getTotalInvestment())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}
