package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.Inmueble;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Inmueble entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InmuebleRepository extends JpaRepository<Inmueble, Long> {}
