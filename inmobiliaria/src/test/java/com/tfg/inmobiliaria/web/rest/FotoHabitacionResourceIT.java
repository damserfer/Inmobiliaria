package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.FotoHabitacion;
import com.tfg.inmobiliaria.repository.FotoHabitacionRepository;
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
 * Integration tests for the {@link FotoHabitacionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FotoHabitacionResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/foto-habitacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FotoHabitacionRepository fotoHabitacionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFotoHabitacionMockMvc;

    private FotoHabitacion fotoHabitacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FotoHabitacion createEntity(EntityManager em) {
        FotoHabitacion fotoHabitacion = new FotoHabitacion().url(DEFAULT_URL);
        return fotoHabitacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FotoHabitacion createUpdatedEntity(EntityManager em) {
        FotoHabitacion fotoHabitacion = new FotoHabitacion().url(UPDATED_URL);
        return fotoHabitacion;
    }

    @BeforeEach
    public void initTest() {
        fotoHabitacion = createEntity(em);
    }

    @Test
    @Transactional
    void createFotoHabitacion() throws Exception {
        int databaseSizeBeforeCreate = fotoHabitacionRepository.findAll().size();
        // Create the FotoHabitacion
        restFotoHabitacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isCreated());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeCreate + 1);
        FotoHabitacion testFotoHabitacion = fotoHabitacionList.get(fotoHabitacionList.size() - 1);
        assertThat(testFotoHabitacion.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void createFotoHabitacionWithExistingId() throws Exception {
        // Create the FotoHabitacion with an existing ID
        fotoHabitacion.setId(1L);

        int databaseSizeBeforeCreate = fotoHabitacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFotoHabitacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFotoHabitacions() throws Exception {
        // Initialize the database
        fotoHabitacionRepository.saveAndFlush(fotoHabitacion);

        // Get all the fotoHabitacionList
        restFotoHabitacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fotoHabitacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)));
    }

    @Test
    @Transactional
    void getFotoHabitacion() throws Exception {
        // Initialize the database
        fotoHabitacionRepository.saveAndFlush(fotoHabitacion);

        // Get the fotoHabitacion
        restFotoHabitacionMockMvc
            .perform(get(ENTITY_API_URL_ID, fotoHabitacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fotoHabitacion.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL));
    }

    @Test
    @Transactional
    void getNonExistingFotoHabitacion() throws Exception {
        // Get the fotoHabitacion
        restFotoHabitacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFotoHabitacion() throws Exception {
        // Initialize the database
        fotoHabitacionRepository.saveAndFlush(fotoHabitacion);

        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();

        // Update the fotoHabitacion
        FotoHabitacion updatedFotoHabitacion = fotoHabitacionRepository.findById(fotoHabitacion.getId()).get();
        // Disconnect from session so that the updates on updatedFotoHabitacion are not directly saved in db
        em.detach(updatedFotoHabitacion);
        updatedFotoHabitacion.url(UPDATED_URL);

        restFotoHabitacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFotoHabitacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFotoHabitacion))
            )
            .andExpect(status().isOk());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
        FotoHabitacion testFotoHabitacion = fotoHabitacionList.get(fotoHabitacionList.size() - 1);
        assertThat(testFotoHabitacion.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void putNonExistingFotoHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();
        fotoHabitacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotoHabitacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fotoHabitacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFotoHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();
        fotoHabitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoHabitacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFotoHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();
        fotoHabitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoHabitacionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotoHabitacion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFotoHabitacionWithPatch() throws Exception {
        // Initialize the database
        fotoHabitacionRepository.saveAndFlush(fotoHabitacion);

        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();

        // Update the fotoHabitacion using partial update
        FotoHabitacion partialUpdatedFotoHabitacion = new FotoHabitacion();
        partialUpdatedFotoHabitacion.setId(fotoHabitacion.getId());

        restFotoHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFotoHabitacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFotoHabitacion))
            )
            .andExpect(status().isOk());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
        FotoHabitacion testFotoHabitacion = fotoHabitacionList.get(fotoHabitacionList.size() - 1);
        assertThat(testFotoHabitacion.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void fullUpdateFotoHabitacionWithPatch() throws Exception {
        // Initialize the database
        fotoHabitacionRepository.saveAndFlush(fotoHabitacion);

        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();

        // Update the fotoHabitacion using partial update
        FotoHabitacion partialUpdatedFotoHabitacion = new FotoHabitacion();
        partialUpdatedFotoHabitacion.setId(fotoHabitacion.getId());

        partialUpdatedFotoHabitacion.url(UPDATED_URL);

        restFotoHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFotoHabitacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFotoHabitacion))
            )
            .andExpect(status().isOk());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
        FotoHabitacion testFotoHabitacion = fotoHabitacionList.get(fotoHabitacionList.size() - 1);
        assertThat(testFotoHabitacion.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void patchNonExistingFotoHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();
        fotoHabitacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotoHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fotoHabitacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFotoHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();
        fotoHabitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFotoHabitacion() throws Exception {
        int databaseSizeBeforeUpdate = fotoHabitacionRepository.findAll().size();
        fotoHabitacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoHabitacionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fotoHabitacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FotoHabitacion in the database
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFotoHabitacion() throws Exception {
        // Initialize the database
        fotoHabitacionRepository.saveAndFlush(fotoHabitacion);

        int databaseSizeBeforeDelete = fotoHabitacionRepository.findAll().size();

        // Delete the fotoHabitacion
        restFotoHabitacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, fotoHabitacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FotoHabitacion> fotoHabitacionList = fotoHabitacionRepository.findAll();
        assertThat(fotoHabitacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
