package com.tfg.inmobiliaria.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tfg.inmobiliaria.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InmuebleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Inmueble.class);
        Inmueble inmueble1 = new Inmueble();
        inmueble1.setId(1L);
        Inmueble inmueble2 = new Inmueble();
        inmueble2.setId(inmueble1.getId());
        assertThat(inmueble1).isEqualTo(inmueble2);
        inmueble2.setId(2L);
        assertThat(inmueble1).isNotEqualTo(inmueble2);
        inmueble1.setId(null);
        assertThat(inmueble1).isNotEqualTo(inmueble2);
    }
}
