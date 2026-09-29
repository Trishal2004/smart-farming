package com.smartfarming.service;

import com.smartfarming.dto.farmer.FarmerProfileRequest;
import com.smartfarming.dto.farmer.FarmerProfileResponse;
import com.smartfarming.entity.FarmerProfile;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.repository.FarmerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FarmerProfileService {

    private final FarmerProfileRepository farmerProfileRepository;

    public FarmerProfile getCurrentProfile(User user) {
        return farmerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for the current user"));
    }

    public FarmerProfileResponse getProfile(User user) {
        return mapToResponse(getCurrentProfile(user));
    }

    public FarmerProfileResponse updateProfile(User user, FarmerProfileRequest request) {
        FarmerProfile profile = getCurrentProfile(user);
        
        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());

        profile = farmerProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    private FarmerProfileResponse mapToResponse(FarmerProfile profile) {
        return FarmerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getFullName())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .build();
    }
}
