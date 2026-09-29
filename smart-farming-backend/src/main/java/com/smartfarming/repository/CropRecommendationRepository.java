package com.smartfarming.repository;

import com.smartfarming.entity.CropRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRecommendationRepository extends JpaRepository<CropRecommendation, Long> {
    List<CropRecommendation> findBySeasonId(Long seasonId);
}
