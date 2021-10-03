package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.Habitacion;
import com.tfg.inmobiliaria.repository.HabitacionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HabitacionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HabitacionResourceIT {

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/habitacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHabitacionMockMvc;

    private Habitacion habitacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Habitacion createEntity(EntityManager em) {
        Habitacion habitacion = new Habitacion().precio(DEFAULT_PRECIO).descripcion(DEFAULT_DESCRIPCION);
        return habitacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Habitacion createUpdatedEntity(EntityManager em) {
        Habitacion habitacion = new Habitacion().precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);
        return habitacion;
    }

    @BeforeEach
    public void initTest() {
        habitacion = createEntity(em);
    }

    @Test
    @Transactional
    void createHabitacion() throws Exception {
        int databaseSizeBeforeCreate = habitacionRepository.findAll().size();
        // Create the Habitacion
        restHabitacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitacion)))
            .andExpect(status().isCreated());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeCreate + 1);
        Habitacion testHabitacion = habitacionList.get(habitacionList.size() - 1);
        assertThat(testHabitacion.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testHabitacion.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createHabitacionWithExistingId() throws Exception {
        // Create the Habitacion with an existing ID
        habitacion.setId(1L);

        int databaseSizeBeforeCreate = habitacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHabitacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitacion)))
            .andExpect(status().isBadRequest());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHabitacions() throws Exception {
        // Initialize the database
        habitacionRepository.saveAndFlush(habitacion);

        // Get all the habitacionList
        restHabitacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(habitacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getHabitacion() throws Exception {
        // Initialize the database
        habitacionRepository.saveAndFlush(habitacion);

        // Get the habitacion
        restHabitacionMockMvc
            .perform(get(ENTITY_API_URL_ID, habitacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(habitacion.getId().intValue()))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingHabitacion() throws Exception {
        // Get the habitacion
        restHabitacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewHabitacion() throws Exception {
        // Initialize the database
        habitacionRepository.saveAndFlush(habitacion);

        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();

        // Update the habitacion
        Habitacion updatedHabitacion = habitacionRepository.findById(habitacion.getId()).get();
        // Disconnect from session so that the updates on updatedHabitacion are not directly saved in db
        em.detach(updatedHabitacion);
        updatedHabitacion.precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);

        restHabitacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHabitacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHabitacion))
            )
            .andExpect(status().isOk());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
        Habitacion testHabitacion = habitacionList.get(habitacionList.size() - 1);
        assertThat(testHabitacion.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testHabitacion.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();
        habitacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, habitacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();
        habitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(habitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();
        habitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitacionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(habitacion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHabitacionWithPatch() throws Exception {
        // Initialize the database
        habitacionRepository.saveAndFlush(habitacion);

        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();

        // Update the habitacion using partial update
        Habitacion partialUpdatedHabitacion = new Habitacion();
        partialUpdatedHabitacion.setId(habitacion.getId());

        partialUpdatedHabitacion.precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);

        restHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabitacion))
            )
            .andExpect(status().isOk());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
        Habitacion testHabitacion = habitacionList.get(habitacionList.size() - 1);
        assertThat(testHabitacion.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testHabitacion.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdateHabitacionWithPatch() throws Exception {
        // Initialize the database
        habitacionRepository.saveAndFlush(habitacion);

        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();

        // Update the habitacion using partial update
        Habitacion partialUpdatedHabitacion = new Habitacion();
        partialUpdatedHabitacion.setId(habitacion.getId());

        partialUpdatedHabitacion.precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);

        restHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHabitacion))
            )
            .andExpect(status().isOk());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
        Habitacion testHabitacion = habitacionList.get(habitacionList.size() - 1);
        assertThat(testHabitacion.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testHabitacion.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();
        habitacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, habitacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();
        habitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(habitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = habitacionRepository.findAll().size();
        habitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(habitacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Habitacion in the database
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHabitacion() throws Exception {
        // Initialize the database
        habitacionRepository.saveAndFlush(habitacion);

        int databaseSizeBeforeDelete = habitacionRepository.findAll().size();

        // Delete the habitacion
        restHabitacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, habitacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Habitacion> habitacionList = habitacionRepository.findAll();
        assertThat(habitacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
