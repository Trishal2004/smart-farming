package com.smartfarming.service;

import com.smartfarming.dto.season.SeasonRequest;
import com.smartfarming.dto.season.SeasonResponse;
import com.smartfarming.entity.Farm;
import com.smartfarming.entity.Season;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.exception.UnauthorizedAccessException;
import com.smartfarming.repository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonRepository seasonRepository;
    private final FarmService farmService;

    public SeasonResponse createSeason(Long farmId, User user, SeasonRequest request) {
        Farm farm = farmService.getFarmEntityAndVerifyOwnership(farmId, user);

        Season season = Season.builder()
                .farm(farm)
                .seasonName(request.getSeasonName())
                .startDate(request.getStartDate())
                .expectedEndDate(request.getExpectedEndDate())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        season = seasonRepository.save(season);
        return mapToResponse(season);
    }

    public List<SeasonResponse> getSeasonsByFarmId(Long farmId, User user) {
        farmService.getFarmEntityAndVerifyOwnership(farmId, user); // Verify ownership first
        return seasonRepository.findByFarmId(farmId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Season getSeasonEntityAndVerifyOwnership(Long seasonId, User user) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new ResourceNotFoundException("Season not found with id " + seasonId));

        if (!season.getFarm().getFarmerProfile().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this season");
        }
        return season;
    }

    public SeasonResponse getSeasonById(Long id, User user) {
        Season season = getSeasonEntityAndVerifyOwnership(id, user);
        return mapToResponse(season);
    }

    public SeasonResponse updateSeason(Long id, User user, SeasonRequest request) {
        Season season = getSeasonEntityAndVerifyOwnership(id, user);

        season.setSeasonName(request.getSeasonName());
        season.setStartDate(request.getStartDate());
        season.setExpectedEndDate(request.getExpectedEndDate());
        season.setStatus(request.getStatus());

        season = seasonRepository.save(season);
        return mapToResponse(season);
    }

    public void deleteSeason(Long id, User user) {
        Season season = getSeasonEntityAndVerifyOwnership(id, user);
        seasonRepository.delete(season);
    }

    private SeasonResponse mapToResponse(Season season) {
        return SeasonResponse.builder()
                .id(season.getId())
                .farmId(season.getFarm().getId())
                .seasonName(season.getSeasonName())
                .startDate(season.getStartDate())
                .expectedEndDate(season.getExpectedEndDate())
                .status(season.getStatus())
                .build();
    }
}
