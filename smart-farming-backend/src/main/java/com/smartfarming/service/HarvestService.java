package com.smartfarming.service;

import com.smartfarming.dto.harvest.HarvestRequest;
import com.smartfarming.dto.harvest.HarvestResponse;
import com.smartfarming.entity.Harvest;
import com.smartfarming.entity.Season;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.exception.UnauthorizedAccessException;
import com.smartfarming.repository.HarvestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HarvestService {

    private final HarvestRepository harvestRepository;
    private final SeasonService seasonService;

    public HarvestResponse createHarvest(Long seasonId, User user, HarvestRequest request) {
        Season season = seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);

        Double income = request.getQuantity() * request.getSellingPricePerKg();

        Harvest harvest = Harvest.builder()
                .season(season)
                .harvestDate(request.getHarvestDate())
                .quantity(request.getQuantity())
                .sellingPricePerKg(request.getSellingPricePerKg())
                .buyerName(request.getBuyerName())
                .totalIncome(income)
                .build();

        harvest = harvestRepository.save(harvest);
        return mapToResponse(harvest);
    }

    public List<HarvestResponse> getHarvestsBySeasonId(Long seasonId, User user) {
        seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);
        return harvestRepository.findBySeasonId(seasonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Harvest getHarvestEntityAndVerifyOwnership(Long id, User user) {
        Harvest harvest = harvestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Harvest record not found"));

        if (!harvest.getSeason().getFarm().getFarmerProfile().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this harvest record");
        }
        return harvest;
    }

    public HarvestResponse getHarvestById(Long id, User user) {
        Harvest harvest = getHarvestEntityAndVerifyOwnership(id, user);
        return mapToResponse(harvest);
    }

    public HarvestResponse updateHarvest(Long id, User user, HarvestRequest request) {
        Harvest harvest = getHarvestEntityAndVerifyOwnership(id, user);

        harvest.setHarvestDate(request.getHarvestDate());
        harvest.setQuantity(request.getQuantity());
        harvest.setSellingPricePerKg(request.getSellingPricePerKg());
        harvest.setBuyerName(request.getBuyerName());
        harvest.setTotalIncome(request.getQuantity() * request.getSellingPricePerKg());

        harvest = harvestRepository.save(harvest);
        return mapToResponse(harvest);
    }

    public void deleteHarvest(Long id, User user) {
        Harvest harvest = getHarvestEntityAndVerifyOwnership(id, user);
        harvestRepository.delete(harvest);
    }

    private HarvestResponse mapToResponse(Harvest harvest) {
        return HarvestResponse.builder()
                .id(harvest.getId())
                .seasonId(harvest.getSeason().getId())
                .harvestDate(harvest.getHarvestDate())
                .quantity(harvest.getQuantity())
                .sellingPricePerKg(harvest.getSellingPricePerKg())
                .buyerName(harvest.getBuyerName())
                .totalIncome(harvest.getTotalIncome())
                .createdAt(harvest.getCreatedAt())
                .build();
    }
}
