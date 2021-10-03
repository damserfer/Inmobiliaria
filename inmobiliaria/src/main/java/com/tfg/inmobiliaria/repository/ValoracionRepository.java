package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.Valoracion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Valoracion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {}
