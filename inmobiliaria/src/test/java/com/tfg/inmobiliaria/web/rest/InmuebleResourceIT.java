package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.Inmueble;
import com.tfg.inmobiliaria.repository.InmuebleRepository;
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
 * Integration tests for the {@link InmuebleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InmuebleResourceIT {

    private static final String DEFAULT_CALLE = "AAAAAAAAAA";
    private static final String UPDATED_CALLE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMERO = 1;
    private static final Integer UPDATED_NUMERO = 2;

    private static final Integer DEFAULT_ESCALERA = 1;
    private static final Integer UPDATED_ESCALERA = 2;

    private static final Integer DEFAULT_COD_POSTAL = 1;
    private static final Integer UPDATED_COD_POSTAL = 2;

    private static final String DEFAULT_CIUDAD = "AAAAAAAAAA";
    private static final String UPDATED_CIUDAD = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final Integer DEFAULT_NBANIOS = 1;
    private static final Integer UPDATED_NBANIOS = 2;

    private static final String ENTITY_API_URL = "/api/inmuebles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InmuebleRepository inmuebleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInmuebleMockMvc;

    private Inmueble inmueble;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inmueble createEntity(EntityManager em) {
        Inmueble inmueble = new Inmueble()
            .calle(DEFAULT_CALLE)
            .numero(DEFAULT_NUMERO)
            .escalera(DEFAULT_ESCALERA)
            .codPostal(DEFAULT_COD_POSTAL)
            .ciudad(DEFAULT_CIUDAD)
            .descripcion(DEFAULT_DESCRIPCION)
            .nbanios(DEFAULT_NBANIOS);
        return inmueble;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inmueble createUpdatedEntity(EntityManager em) {
        Inmueble inmueble = new Inmueble()
            .calle(UPDATED_CALLE)
            .numero(UPDATED_NUMERO)
            .escalera(UPDATED_ESCALERA)
            .codPostal(UPDATED_COD_POSTAL)
            .ciudad(UPDATED_CIUDAD)
            .descripcion(UPDATED_DESCRIPCION)
            .nbanios(UPDATED_NBANIOS);
        return inmueble;
    }

    @BeforeEach
    public void initTest() {
        inmueble = createEntity(em);
    }

    @Test
    @Transactional
    void createInmueble() throws Exception {
        int databaseSizeBeforeCreate = inmuebleRepository.findAll().size();
        // Create the Inmueble
        restInmuebleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inmueble)))
            .andExpect(status().isCreated());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeCreate + 1);
        Inmueble testInmueble = inmuebleList.get(inmuebleList.size() - 1);
        assertThat(testInmueble.getCalle()).isEqualTo(DEFAULT_CALLE);
        assertThat(testInmueble.getNumero()).isEqualTo(DEFAULT_NUMERO);
        assertThat(testInmueble.getEscalera()).isEqualTo(DEFAULT_ESCALERA);
        assertThat(testInmueble.getCodPostal()).isEqualTo(DEFAULT_COD_POSTAL);
        assertThat(testInmueble.getCiudad()).isEqualTo(DEFAULT_CIUDAD);
        assertThat(testInmueble.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testInmueble.getNbanios()).isEqualTo(DEFAULT_NBANIOS);
    }

    @Test
    @Transactional
    void createInmuebleWithExistingId() throws Exception {
        // Create the Inmueble with an existing ID
        inmueble.setId(1L);

        int databaseSizeBeforeCreate = inmuebleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInmuebleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inmueble)))
            .andExpect(status().isBadRequest());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInmuebles() throws Exception {
        // Initialize the database
        inmuebleRepository.saveAndFlush(inmueble);

        // Get all the inmuebleList
        restInmuebleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inmueble.getId().intValue())))
            .andExpect(jsonPath("$.[*].calle").value(hasItem(DEFAULT_CALLE)))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)))
            .andExpect(jsonPath("$.[*].escalera").value(hasItem(DEFAULT_ESCALERA)))
            .andExpect(jsonPath("$.[*].codPostal").value(hasItem(DEFAULT_COD_POSTAL)))
            .andExpect(jsonPath("$.[*].ciudad").value(hasItem(DEFAULT_CIUDAD)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].nbanios").value(hasItem(DEFAULT_NBANIOS)));
    }

    @Test
    @Transactional
    void getInmueble() throws Exception {
        // Initialize the database
        inmuebleRepository.saveAndFlush(inmueble);

        // Get the inmueble
        restInmuebleMockMvc
            .perform(get(ENTITY_API_URL_ID, inmueble.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(inmueble.getId().intValue()))
            .andExpect(jsonPath("$.calle").value(DEFAULT_CALLE))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO))
            .andExpect(jsonPath("$.escalera").value(DEFAULT_ESCALERA))
            .andExpect(jsonPath("$.codPostal").value(DEFAULT_COD_POSTAL))
            .andExpect(jsonPath("$.ciudad").value(DEFAULT_CIUDAD))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.nbanios").value(DEFAULT_NBANIOS));
    }

    @Test
    @Transactional
    void getNonExistingInmueble() throws Exception {
        // Get the inmueble
        restInmuebleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInmueble() throws Exception {
        // Initialize the database
        inmuebleRepository.saveAndFlush(inmueble);

        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();

        // Update the inmueble
        Inmueble updatedInmueble = inmuebleRepository.findById(inmueble.getId()).get();
        // Disconnect from session so that the updates on updatedInmueble are not directly saved in db
        em.detach(updatedInmueble);
        updatedInmueble
            .calle(UPDATED_CALLE)
            .numero(UPDATED_NUMERO)
            .escalera(UPDATED_ESCALERA)
            .codPostal(UPDATED_COD_POSTAL)
            .ciudad(UPDATED_CIUDAD)
            .descripcion(UPDATED_DESCRIPCION)
            .nbanios(UPDATED_NBANIOS);

        restInmuebleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInmueble.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInmueble))
            )
            .andExpect(status().isOk());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
        Inmueble testInmueble = inmuebleList.get(inmuebleList.size() - 1);
        assertThat(testInmueble.getCalle()).isEqualTo(UPDATED_CALLE);
        assertThat(testInmueble.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testInmueble.getEscalera()).isEqualTo(UPDATED_ESCALERA);
        assertThat(testInmueble.getCodPostal()).isEqualTo(UPDATED_COD_POSTAL);
        assertThat(testInmueble.getCiudad()).isEqualTo(UPDATED_CIUDAD);
        assertThat(testInmueble.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testInmueble.getNbanios()).isEqualTo(UPDATED_NBANIOS);
    }

    @Test
    @Transactional
    void putNonExistingInmueble() throws Exception {
        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();
        inmueble.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInmuebleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, inmueble.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inmueble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInmueble() throws Exception {
        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();
        inmueble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInmuebleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inmueble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInmueble() throws Exception {
        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();
        inmueble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInmuebleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inmueble)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInmuebleWithPatch() throws Exception {
        // Initialize the database
        inmuebleRepository.saveAndFlush(inmueble);

        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();

        // Update the inmueble using partial update
        Inmueble partialUpdatedInmueble = new Inmueble();
        partialUpdatedInmueble.setId(inmueble.getId());

        partialUpdatedInmueble.calle(UPDATED_CALLE).ciudad(UPDATED_CIUDAD);

        restInmuebleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInmueble.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInmueble))
            )
            .andExpect(status().isOk());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
        Inmueble testInmueble = inmuebleList.get(inmuebleList.size() - 1);
        assertThat(testInmueble.getCalle()).isEqualTo(UPDATED_CALLE);
        assertThat(testInmueble.getNumero()).isEqualTo(DEFAULT_NUMERO);
        assertThat(testInmueble.getEscalera()).isEqualTo(DEFAULT_ESCALERA);
        assertThat(testInmueble.getCodPostal()).isEqualTo(DEFAULT_COD_POSTAL);
        assertThat(testInmueble.getCiudad()).isEqualTo(UPDATED_CIUDAD);
        assertThat(testInmueble.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testInmueble.getNbanios()).isEqualTo(DEFAULT_NBANIOS);
    }

    @Test
    @Transactional
    void fullUpdateInmuebleWithPatch() throws Exception {
        // Initialize the database
        inmuebleRepository.saveAndFlush(inmueble);

        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();

        // Update the inmueble using partial update
        Inmueble partialUpdatedInmueble = new Inmueble();
        partialUpdatedInmueble.setId(inmueble.getId());

        partialUpdatedInmueble
            .calle(UPDATED_CALLE)
            .numero(UPDATED_NUMERO)
            .escalera(UPDATED_ESCALERA)
            .codPostal(UPDATED_COD_POSTAL)
            .ciudad(UPDATED_CIUDAD)
            .descripcion(UPDATED_DESCRIPCION)
            .nbanios(UPDATED_NBANIOS);

        restInmuebleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInmueble.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInmueble))
            )
            .andExpect(status().isOk());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
        Inmueble testInmueble = inmuebleList.get(inmuebleList.size() - 1);
        assertThat(testInmueble.getCalle()).isEqualTo(UPDATED_CALLE);
        assertThat(testInmueble.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testInmueble.getEscalera()).isEqualTo(UPDATED_ESCALERA);
        assertThat(testInmueble.getCodPostal()).isEqualTo(UPDATED_COD_POSTAL);
        assertThat(testInmueble.getCiudad()).isEqualTo(UPDATED_CIUDAD);
        assertThat(testInmueble.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testInmueble.getNbanios()).isEqualTo(UPDATED_NBANIOS);
    }

    @Test
    @Transactional
    void patchNonExistingInmueble() throws Exception {
        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();
        inmueble.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInmuebleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, inmueble.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inmueble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInmueble() throws Exception {
        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();
        inmueble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInmuebleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inmueble))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInmueble() throws Exception {
        int databaseSizeBeforeUpdate = inmuebleRepository.findAll().size();
        inmueble.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInmuebleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(inmueble)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inmueble in the database
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInmueble() throws Exception {
        // Initialize the database
        inmuebleRepository.saveAndFlush(inmueble);

        int databaseSizeBeforeDelete = inmuebleRepository.findAll().size();

        // Delete the inmueble
        restInmuebleMockMvc
            .perform(delete(ENTITY_API_URL_ID, inmueble.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Inmueble> inmuebleList = inmuebleRepository.findAll();
        assertThat(inmuebleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
