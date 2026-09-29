package com.smartfarming.service;

import com.smartfarming.dto.diary.FarmActivityRequest;
import com.smartfarming.dto.diary.FarmActivityResponse;
import com.smartfarming.entity.FarmActivity;
import com.smartfarming.entity.Season;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.exception.UnauthorizedAccessException;
import com.smartfarming.repository.FarmActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmActivityService {

    private final FarmActivityRepository activityRepository;
    private final SeasonService seasonService;

    public FarmActivityResponse createActivity(Long seasonId, User user, FarmActivityRequest request) {
        Season season = seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);

        FarmActivity activity = FarmActivity.builder()
                .season(season)
                .date(request.getDate())
                .activityType(request.getActivityType())
                .notes(request.getNotes())
                .build();

        activity = activityRepository.save(activity);
        return mapToResponse(activity);
    }

    public List<FarmActivityResponse> getActivitiesBySeasonId(Long seasonId, User user) {
        seasonService.getSeasonEntityAndVerifyOwnership(seasonId, user);
        return activityRepository.findBySeasonId(seasonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private FarmActivity getActivityEntityAndVerifyOwnership(Long id, User user) {
        FarmActivity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        if (!activity.getSeason().getFarm().getFarmerProfile().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this activity");
        }
        return activity;
    }

    public FarmActivityResponse getActivityById(Long id, User user) {
        FarmActivity activity = getActivityEntityAndVerifyOwnership(id, user);
        return mapToResponse(activity);
    }

    public FarmActivityResponse updateActivity(Long id, User user, FarmActivityRequest request) {
        FarmActivity activity = getActivityEntityAndVerifyOwnership(id, user);

        activity.setDate(request.getDate());
        activity.setActivityType(request.getActivityType());
        activity.setNotes(request.getNotes());

        activity = activityRepository.save(activity);
        return mapToResponse(activity);
    }

    public void deleteActivity(Long id, User user) {
        FarmActivity activity = getActivityEntityAndVerifyOwnership(id, user);
        activityRepository.delete(activity);
    }

    private FarmActivityResponse mapToResponse(FarmActivity activity) {
        return FarmActivityResponse.builder()
                .id(activity.getId())
                .seasonId(activity.getSeason().getId())
                .date(activity.getDate())
                .activityType(activity.getActivityType())
                .notes(activity.getNotes())
                .createdAt(activity.getCreatedAt())
                .build();
    }
}
