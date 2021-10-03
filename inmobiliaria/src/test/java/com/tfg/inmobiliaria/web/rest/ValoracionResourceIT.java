package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.Valoracion;
import com.tfg.inmobiliaria.repository.ValoracionRepository;
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
 * Integration tests for the {@link ValoracionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ValoracionResourceIT {

    private static final String DEFAULT_COMENTARIO = "AAAAAAAAAA";
    private static final String UPDATED_COMENTARIO = "BBBBBBBBBB";

    private static final Integer DEFAULT_PUNTUACION = 1;
    private static final Integer UPDATED_PUNTUACION = 2;

    private static final String ENTITY_API_URL = "/api/valoracions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restValoracionMockMvc;

    private Valoracion valoracion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Valoracion createEntity(EntityManager em) {
        Valoracion valoracion = new Valoracion().comentario(DEFAULT_COMENTARIO).puntuacion(DEFAULT_PUNTUACION);
        return valoracion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Valoracion createUpdatedEntity(EntityManager em) {
        Valoracion valoracion = new Valoracion().comentario(UPDATED_COMENTARIO).puntuacion(UPDATED_PUNTUACION);
        return valoracion;
    }

    @BeforeEach
    public void initTest() {
        valoracion = createEntity(em);
    }

    @Test
    @Transactional
    void createValoracion() throws Exception {
        int databaseSizeBeforeCreate = valoracionRepository.findAll().size();
        // Create the Valoracion
        restValoracionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(valoracion)))
            .andExpect(status().isCreated());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeCreate + 1);
        Valoracion testValoracion = valoracionList.get(valoracionList.size() - 1);
        assertThat(testValoracion.getComentario()).isEqualTo(DEFAULT_COMENTARIO);
        assertThat(testValoracion.getPuntuacion()).isEqualTo(DEFAULT_PUNTUACION);
    }

    @Test
    @Transactional
    void createValoracionWithExistingId() throws Exception {
        // Create the Valoracion with an existing ID
        valoracion.setId(1L);

        int databaseSizeBeforeCreate = valoracionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restValoracionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(valoracion)))
            .andExpect(status().isBadRequest());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllValoracions() throws Exception {
        // Initialize the database
        valoracionRepository.saveAndFlush(valoracion);

        // Get all the valoracionList
        restValoracionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(valoracion.getId().intValue())))
            .andExpect(jsonPath("$.[*].comentario").value(hasItem(DEFAULT_COMENTARIO)))
            .andExpect(jsonPath("$.[*].puntuacion").value(hasItem(DEFAULT_PUNTUACION)));
    }

    @Test
    @Transactional
    void getValoracion() throws Exception {
        // Initialize the database
        valoracionRepository.saveAndFlush(valoracion);

        // Get the valoracion
        restValoracionMockMvc
            .perform(get(ENTITY_API_URL_ID, valoracion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(valoracion.getId().intValue()))
            .andExpect(jsonPath("$.comentario").value(DEFAULT_COMENTARIO))
            .andExpect(jsonPath("$.puntuacion").value(DEFAULT_PUNTUACION));
    }

    @Test
    @Transactional
    void getNonExistingValoracion() throws Exception {
        // Get the valoracion
        restValoracionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewValoracion() throws Exception {
        // Initialize the database
        valoracionRepository.saveAndFlush(valoracion);

        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();

        // Update the valoracion
        Valoracion updatedValoracion = valoracionRepository.findById(valoracion.getId()).get();
        // Disconnect from session so that the updates on updatedValoracion are not directly saved in db
        em.detach(updatedValoracion);
        updatedValoracion.comentario(UPDATED_COMENTARIO).puntuacion(UPDATED_PUNTUACION);

        restValoracionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedValoracion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedValoracion))
            )
            .andExpect(status().isOk());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
        Valoracion testValoracion = valoracionList.get(valoracionList.size() - 1);
        assertThat(testValoracion.getComentario()).isEqualTo(UPDATED_COMENTARIO);
        assertThat(testValoracion.getPuntuacion()).isEqualTo(UPDATED_PUNTUACION);
    }

    @Test
    @Transactional
    void putNonExistingValoracion() throws Exception {
        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();
        valoracion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restValoracionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, valoracion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(valoracion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchValoracion() throws Exception {
        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();
        valoracion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restValoracionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(valoracion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamValoracion() throws Exception {
        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();
        valoracion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restValoracionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(valoracion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateValoracionWithPatch() throws Exception {
        // Initialize the database
        valoracionRepository.saveAndFlush(valoracion);

        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();

        // Update the valoracion using partial update
        Valoracion partialUpdatedValoracion = new Valoracion();
        partialUpdatedValoracion.setId(valoracion.getId());

        partialUpdatedValoracion.comentario(UPDATED_COMENTARIO);

        restValoracionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedValoracion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedValoracion))
            )
            .andExpect(status().isOk());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
        Valoracion testValoracion = valoracionList.get(valoracionList.size() - 1);
        assertThat(testValoracion.getComentario()).isEqualTo(UPDATED_COMENTARIO);
        assertThat(testValoracion.getPuntuacion()).isEqualTo(DEFAULT_PUNTUACION);
    }

    @Test
    @Transactional
    void fullUpdateValoracionWithPatch() throws Exception {
        // Initialize the database
        valoracionRepository.saveAndFlush(valoracion);

        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();

        // Update the valoracion using partial update
        Valoracion partialUpdatedValoracion = new Valoracion();
        partialUpdatedValoracion.setId(valoracion.getId());

        partialUpdatedValoracion.comentario(UPDATED_COMENTARIO).puntuacion(UPDATED_PUNTUACION);

        restValoracionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedValoracion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedValoracion))
            )
            .andExpect(status().isOk());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
        Valoracion testValoracion = valoracionList.get(valoracionList.size() - 1);
        assertThat(testValoracion.getComentario()).isEqualTo(UPDATED_COMENTARIO);
        assertThat(testValoracion.getPuntuacion()).isEqualTo(UPDATED_PUNTUACION);
    }

    @Test
    @Transactional
    void patchNonExistingValoracion() throws Exception {
        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();
        valoracion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restValoracionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, valoracion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(valoracion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchValoracion() throws Exception {
        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();
        valoracion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restValoracionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(valoracion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamValoracion() throws Exception {
        int databaseSizeBeforeUpdate = valoracionRepository.findAll().size();
        valoracion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restValoracionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(valoracion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Valoracion in the database
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteValoracion() throws Exception {
        // Initialize the database
        valoracionRepository.saveAndFlush(valoracion);

        int databaseSizeBeforeDelete = valoracionRepository.findAll().size();

        // Delete the valoracion
        restValoracionMockMvc
            .perform(delete(ENTITY_API_URL_ID, valoracion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Valoracion> valoracionList = valoracionRepository.findAll();
        assertThat(valoracionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
