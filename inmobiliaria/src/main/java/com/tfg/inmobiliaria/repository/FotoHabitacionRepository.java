package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.FotoHabitacion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FotoHabitacion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FotoHabitacionRepository extends JpaRepository<FotoHabitacion, Long> {}
