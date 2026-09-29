package com.smartfarming.service;

import com.smartfarming.dto.auth.LoginRequest;
import com.smartfarming.dto.auth.LoginResponse;
import com.smartfarming.dto.auth.RegisterRequest;
import com.smartfarming.entity.FarmerProfile;
import com.smartfarming.entity.User;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.repository.FarmerProfileRepository;
import com.smartfarming.repository.UserRepository;
import com.smartfarming.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByMobileNumber(request.getMobileNumber()).isPresent()) {
            throw new IllegalArgumentException("Mobile number already registered");
        }

        User user = User.builder()
                .mobileNumber(request.getMobileNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("FARMER")
                .build();

        user = userRepository.save(user);

        FarmerProfile profile = FarmerProfile.builder()
                .user(user)
                .fullName(request.getFullName())
                .build();

        farmerProfileRepository.save(profile);

        String jwtToken = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .email(null) // Removed from user model
                .role(user.getRole())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getMobileNumber(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByMobileNumber(request.getMobileNumber())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .email(null) // Removed from user model
                .role(user.getRole())
                .build();
    }
}
