package com.tfg.inmobiliaria.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tfg.inmobiliaria.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IngresoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ingreso.class);
        Ingreso ingreso1 = new Ingreso();
        ingreso1.setId(1L);
        Ingreso ingreso2 = new Ingreso();
        ingreso2.setId(ingreso1.getId());
        assertThat(ingreso1).isEqualTo(ingreso2);
        ingreso2.setId(2L);
        assertThat(ingreso1).isNotEqualTo(ingreso2);
        ingreso1.setId(null);
        assertThat(ingreso1).isNotEqualTo(ingreso2);
    }
}
