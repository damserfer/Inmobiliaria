package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.Ingreso;
import com.tfg.inmobiliaria.repository.IngresoRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link IngresoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IngresoResourceIT {

    private static final LocalDate DEFAULT_MES = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MES = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CONCEPTO = "AAAAAAAAAA";
    private static final String UPDATED_CONCEPTO = "BBBBBBBBBB";

    private static final Integer DEFAULT_CANTIDAD = 1;
    private static final Integer UPDATED_CANTIDAD = 2;

    private static final String ENTITY_API_URL = "/api/ingresos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IngresoRepository ingresoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIngresoMockMvc;

    private Ingreso ingreso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ingreso createEntity(EntityManager em) {
        Ingreso ingreso = new Ingreso().mes(DEFAULT_MES).concepto(DEFAULT_CONCEPTO).cantidad(DEFAULT_CANTIDAD);
        return ingreso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ingreso createUpdatedEntity(EntityManager em) {
        Ingreso ingreso = new Ingreso().mes(UPDATED_MES).concepto(UPDATED_CONCEPTO).cantidad(UPDATED_CANTIDAD);
        return ingreso;
    }

    @BeforeEach
    public void initTest() {
        ingreso = createEntity(em);
    }

    @Test
    @Transactional
    void createIngreso() throws Exception {
        int databaseSizeBeforeCreate = ingresoRepository.findAll().size();
        // Create the Ingreso
        restIngresoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingreso)))
            .andExpect(status().isCreated());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeCreate + 1);
        Ingreso testIngreso = ingresoList.get(ingresoList.size() - 1);
        assertThat(testIngreso.getMes()).isEqualTo(DEFAULT_MES);
        assertThat(testIngreso.getConcepto()).isEqualTo(DEFAULT_CONCEPTO);
        assertThat(testIngreso.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
    }

    @Test
    @Transactional
    void createIngresoWithExistingId() throws Exception {
        // Create the Ingreso with an existing ID
        ingreso.setId(1L);

        int databaseSizeBeforeCreate = ingresoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIngresoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingreso)))
            .andExpect(status().isBadRequest());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIngresos() throws Exception {
        // Initialize the database
        ingresoRepository.saveAndFlush(ingreso);

        // Get all the ingresoList
        restIngresoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ingreso.getId().intValue())))
            .andExpect(jsonPath("$.[*].mes").value(hasItem(DEFAULT_MES.toString())))
            .andExpect(jsonPath("$.[*].concepto").value(hasItem(DEFAULT_CONCEPTO)))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD)));
    }

    @Test
    @Transactional
    void getIngreso() throws Exception {
        // Initialize the database
        ingresoRepository.saveAndFlush(ingreso);

        // Get the ingreso
        restIngresoMockMvc
            .perform(get(ENTITY_API_URL_ID, ingreso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ingreso.getId().intValue()))
            .andExpect(jsonPath("$.mes").value(DEFAULT_MES.toString()))
            .andExpect(jsonPath("$.concepto").value(DEFAULT_CONCEPTO))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD));
    }

    @Test
    @Transactional
    void getNonExistingIngreso() throws Exception {
        // Get the ingreso
        restIngresoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIngreso() throws Exception {
        // Initialize the database
        ingresoRepository.saveAndFlush(ingreso);

        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();

        // Update the ingreso
        Ingreso updatedIngreso = ingresoRepository.findById(ingreso.getId()).get();
        // Disconnect from session so that the updates on updatedIngreso are not directly saved in db
        em.detach(updatedIngreso);
        updatedIngreso.mes(UPDATED_MES).concepto(UPDATED_CONCEPTO).cantidad(UPDATED_CANTIDAD);

        restIngresoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIngreso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIngreso))
            )
            .andExpect(status().isOk());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
        Ingreso testIngreso = ingresoList.get(ingresoList.size() - 1);
        assertThat(testIngreso.getMes()).isEqualTo(UPDATED_MES);
        assertThat(testIngreso.getConcepto()).isEqualTo(UPDATED_CONCEPTO);
        assertThat(testIngreso.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
    }

    @Test
    @Transactional
    void putNonExistingIngreso() throws Exception {
        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();
        ingreso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIngresoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ingreso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ingreso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIngreso() throws Exception {
        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();
        ingreso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngresoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ingreso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIngreso() throws Exception {
        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();
        ingreso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngresoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingreso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIngresoWithPatch() throws Exception {
        // Initialize the database
        ingresoRepository.saveAndFlush(ingreso);

        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();

        // Update the ingreso using partial update
        Ingreso partialUpdatedIngreso = new Ingreso();
        partialUpdatedIngreso.setId(ingreso.getId());

        restIngresoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIngreso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIngreso))
            )
            .andExpect(status().isOk());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
        Ingreso testIngreso = ingresoList.get(ingresoList.size() - 1);
        assertThat(testIngreso.getMes()).isEqualTo(DEFAULT_MES);
        assertThat(testIngreso.getConcepto()).isEqualTo(DEFAULT_CONCEPTO);
        assertThat(testIngreso.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
    }

    @Test
    @Transactional
    void fullUpdateIngresoWithPatch() throws Exception {
        // Initialize the database
        ingresoRepository.saveAndFlush(ingreso);

        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();

        // Update the ingreso using partial update
        Ingreso partialUpdatedIngreso = new Ingreso();
        partialUpdatedIngreso.setId(ingreso.getId());

        partialUpdatedIngreso.mes(UPDATED_MES).concepto(UPDATED_CONCEPTO).cantidad(UPDATED_CANTIDAD);

        restIngresoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIngreso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIngreso))
            )
            .andExpect(status().isOk());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
        Ingreso testIngreso = ingresoList.get(ingresoList.size() - 1);
        assertThat(testIngreso.getMes()).isEqualTo(UPDATED_MES);
        assertThat(testIngreso.getConcepto()).isEqualTo(UPDATED_CONCEPTO);
        assertThat(testIngreso.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
    }

    @Test
    @Transactional
    void patchNonExistingIngreso() throws Exception {
        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();
        ingreso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIngresoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ingreso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingreso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIngreso() throws Exception {
        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();
        ingreso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngresoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingreso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIngreso() throws Exception {
        int databaseSizeBeforeUpdate = ingresoRepository.findAll().size();
        ingreso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngresoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ingreso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ingreso in the database
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIngreso() throws Exception {
        // Initialize the database
        ingresoRepository.saveAndFlush(ingreso);

        int databaseSizeBeforeDelete = ingresoRepository.findAll().size();

        // Delete the ingreso
        restIngresoMockMvc
            .perform(delete(ENTITY_API_URL_ID, ingreso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ingreso> ingresoList = ingresoRepository.findAll();
        assertThat(ingresoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
