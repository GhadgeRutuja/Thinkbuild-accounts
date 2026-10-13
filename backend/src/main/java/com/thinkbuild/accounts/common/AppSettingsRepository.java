package com.thinkbuild.accounts.common;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppSettingsRepository extends JpaRepository<AppSettings, String> {

    @Query("SELECT a.value FROM AppSettings a WHERE a.key = :key")
    Optional<String> findValueByKey(@Param("key") String key);
}
