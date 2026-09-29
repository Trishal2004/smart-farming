package com.smartfarming.service;

import com.smartfarming.dto.farm.FarmRequest;
import com.smartfarming.dto.farm.FarmResponse;
import com.smartfarming.entity.Farm;
import com.smartfarming.entity.FarmerProfile;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.exception.UnauthorizedAccessException;
import com.smartfarming.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;
    private final FarmerProfileService farmerProfileService;

    public FarmResponse createFarm(User user, FarmRequest request) {
        FarmerProfile profile = farmerProfileService.getCurrentProfile(user);

        Farm farm = Farm.builder()
                .farmerProfile(profile)
                .name(request.getName())
                .location(request.getLocation())
                .areaSizeHectares(request.getAreaSizeHectares())
                .primarySoilType(request.getPrimarySoilType())
                .build();

        farm = farmRepository.save(farm);
        return mapToResponse(farm);
    }

    public List<FarmResponse> getMyFarms(User user) {
        FarmerProfile profile = farmerProfileService.getCurrentProfile(user);
        return farmRepository.findByFarmerProfileId(profile.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Farm getFarmEntityAndVerifyOwnership(Long farmId, User user) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id " + farmId));

        if (!farm.getFarmerProfile().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this farm");
        }
        return farm;
    }

    public FarmResponse getFarmById(Long id, User user) {
        Farm farm = getFarmEntityAndVerifyOwnership(id, user);
        return mapToResponse(farm);
    }

    public FarmResponse updateFarm(Long id, User user, FarmRequest request) {
        Farm farm = getFarmEntityAndVerifyOwnership(id, user);

        farm.setName(request.getName());
        farm.setLocation(request.getLocation());
        farm.setAreaSizeHectares(request.getAreaSizeHectares());
        farm.setPrimarySoilType(request.getPrimarySoilType());

        farm = farmRepository.save(farm);
        return mapToResponse(farm);
    }

    public void deleteFarm(Long id, User user) {
        Farm farm = getFarmEntityAndVerifyOwnership(id, user);
        farmRepository.delete(farm);
    }

    private FarmResponse mapToResponse(Farm farm) {
        return FarmResponse.builder()
                .id(farm.getId())
                .farmerProfileId(farm.getFarmerProfile().getId())
                .name(farm.getName())
                .location(farm.getLocation())
                .areaSizeHectares(farm.getAreaSizeHectares())
                .primarySoilType(farm.getPrimarySoilType())
                .build();
    }
}
