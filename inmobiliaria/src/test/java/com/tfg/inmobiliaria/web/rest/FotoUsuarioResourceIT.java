package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.FotoUsuario;
import com.tfg.inmobiliaria.repository.FotoUsuarioRepository;
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
 * Integration tests for the {@link FotoUsuarioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FotoUsuarioResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/foto-usuarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FotoUsuarioRepository fotoUsuarioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFotoUsuarioMockMvc;

    private FotoUsuario fotoUsuario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FotoUsuario createEntity(EntityManager em) {
        FotoUsuario fotoUsuario = new FotoUsuario().url(DEFAULT_URL);
        return fotoUsuario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FotoUsuario createUpdatedEntity(EntityManager em) {
        FotoUsuario fotoUsuario = new FotoUsuario().url(UPDATED_URL);
        return fotoUsuario;
    }

    @BeforeEach
    public void initTest() {
        fotoUsuario = createEntity(em);
    }

    @Test
    @Transactional
    void createFotoUsuario() throws Exception {
        int databaseSizeBeforeCreate = fotoUsuarioRepository.findAll().size();
        // Create the FotoUsuario
        restFotoUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotoUsuario)))
            .andExpect(status().isCreated());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeCreate + 1);
        FotoUsuario testFotoUsuario = fotoUsuarioList.get(fotoUsuarioList.size() - 1);
        assertThat(testFotoUsuario.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void createFotoUsuarioWithExistingId() throws Exception {
        // Create the FotoUsuario with an existing ID
        fotoUsuario.setId(1L);

        int databaseSizeBeforeCreate = fotoUsuarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFotoUsuarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotoUsuario)))
            .andExpect(status().isBadRequest());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFotoUsuarios() throws Exception {
        // Initialize the database
        fotoUsuarioRepository.saveAndFlush(fotoUsuario);

        // Get all the fotoUsuarioList
        restFotoUsuarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fotoUsuario.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)));
    }

    @Test
    @Transactional
    void getFotoUsuario() throws Exception {
        // Initialize the database
        fotoUsuarioRepository.saveAndFlush(fotoUsuario);

        // Get the fotoUsuario
        restFotoUsuarioMockMvc
            .perform(get(ENTITY_API_URL_ID, fotoUsuario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fotoUsuario.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL));
    }

    @Test
    @Transactional
    void getNonExistingFotoUsuario() throws Exception {
        // Get the fotoUsuario
        restFotoUsuarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFotoUsuario() throws Exception {
        // Initialize the database
        fotoUsuarioRepository.saveAndFlush(fotoUsuario);

        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();

        // Update the fotoUsuario
        FotoUsuario updatedFotoUsuario = fotoUsuarioRepository.findById(fotoUsuario.getId()).get();
        // Disconnect from session so that the updates on updatedFotoUsuario are not directly saved in db
        em.detach(updatedFotoUsuario);
        updatedFotoUsuario.url(UPDATED_URL);

        restFotoUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFotoUsuario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFotoUsuario))
            )
            .andExpect(status().isOk());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
        FotoUsuario testFotoUsuario = fotoUsuarioList.get(fotoUsuarioList.size() - 1);
        assertThat(testFotoUsuario.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void putNonExistingFotoUsuario() throws Exception {
        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();
        fotoUsuario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotoUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fotoUsuario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fotoUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFotoUsuario() throws Exception {
        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();
        fotoUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoUsuarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fotoUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFotoUsuario() throws Exception {
        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();
        fotoUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoUsuarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotoUsuario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFotoUsuarioWithPatch() throws Exception {
        // Initialize the database
        fotoUsuarioRepository.saveAndFlush(fotoUsuario);

        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();

        // Update the fotoUsuario using partial update
        FotoUsuario partialUpdatedFotoUsuario = new FotoUsuario();
        partialUpdatedFotoUsuario.setId(fotoUsuario.getId());

        restFotoUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFotoUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFotoUsuario))
            )
            .andExpect(status().isOk());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
        FotoUsuario testFotoUsuario = fotoUsuarioList.get(fotoUsuarioList.size() - 1);
        assertThat(testFotoUsuario.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void fullUpdateFotoUsuarioWithPatch() throws Exception {
        // Initialize the database
        fotoUsuarioRepository.saveAndFlush(fotoUsuario);

        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();

        // Update the fotoUsuario using partial update
        FotoUsuario partialUpdatedFotoUsuario = new FotoUsuario();
        partialUpdatedFotoUsuario.setId(fotoUsuario.getId());

        partialUpdatedFotoUsuario.url(UPDATED_URL);

        restFotoUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFotoUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFotoUsuario))
            )
            .andExpect(status().isOk());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
        FotoUsuario testFotoUsuario = fotoUsuarioList.get(fotoUsuarioList.size() - 1);
        assertThat(testFotoUsuario.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void patchNonExistingFotoUsuario() throws Exception {
        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();
        fotoUsuario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotoUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fotoUsuario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fotoUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFotoUsuario() throws Exception {
        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();
        fotoUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fotoUsuario))
            )
            .andExpect(status().isBadRequest());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFotoUsuario() throws Exception {
        int databaseSizeBeforeUpdate = fotoUsuarioRepository.findAll().size();
        fotoUsuario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotoUsuarioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fotoUsuario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FotoUsuario in the database
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFotoUsuario() throws Exception {
        // Initialize the database
        fotoUsuarioRepository.saveAndFlush(fotoUsuario);

        int databaseSizeBeforeDelete = fotoUsuarioRepository.findAll().size();

        // Delete the fotoUsuario
        restFotoUsuarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, fotoUsuario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FotoUsuario> fotoUsuarioList = fotoUsuarioRepository.findAll();
        assertThat(fotoUsuarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
