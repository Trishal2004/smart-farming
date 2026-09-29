package com.smartfarming.repository;

import com.smartfarming.entity.FarmActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmActivityRepository extends JpaRepository<FarmActivity, Long> {
    List<FarmActivity> findBySeasonId(Long seasonId);
}
