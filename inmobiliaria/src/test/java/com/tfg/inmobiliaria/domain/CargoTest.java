package com.tfg.inmobiliaria.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tfg.inmobiliaria.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CargoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cargo.class);
        Cargo cargo1 = new Cargo();
        cargo1.setId(1L);
        Cargo cargo2 = new Cargo();
        cargo2.setId(cargo1.getId());
        assertThat(cargo1).isEqualTo(cargo2);
        cargo2.setId(2L);
        assertThat(cargo1).isNotEqualTo(cargo2);
        cargo1.setId(null);
        assertThat(cargo1).isNotEqualTo(cargo2);
    }
}
