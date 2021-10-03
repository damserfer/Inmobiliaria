package com.tfg.inmobiliaria.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tfg.inmobiliaria.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FotoHabitacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FotoHabitacion.class);
        FotoHabitacion fotoHabitacion1 = new FotoHabitacion();
        fotoHabitacion1.setId(1L);
        FotoHabitacion fotoHabitacion2 = new FotoHabitacion();
        fotoHabitacion2.setId(fotoHabitacion1.getId());
        assertThat(fotoHabitacion1).isEqualTo(fotoHabitacion2);
        fotoHabitacion2.setId(2L);
        assertThat(fotoHabitacion1).isNotEqualTo(fotoHabitacion2);
        fotoHabitacion1.setId(null);
        assertThat(fotoHabitacion1).isNotEqualTo(fotoHabitacion2);
    }
}
