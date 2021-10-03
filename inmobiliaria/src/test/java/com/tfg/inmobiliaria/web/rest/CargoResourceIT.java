package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.Cargo;
import com.tfg.inmobiliaria.domain.enumeration.Concepto;
import com.tfg.inmobiliaria.domain.enumeration.Mes;
import com.tfg.inmobiliaria.repository.CargoRepository;
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
 * Integration tests for the {@link CargoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CargoResourceIT {

    private static final LocalDate DEFAULT_FECHA_CARGO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_CARGO = LocalDate.now(ZoneId.systemDefault());

    private static final Mes DEFAULT_MES = Mes.Enero;
    private static final Mes UPDATED_MES = Mes.Febrero;

    private static final Integer DEFAULT_EJERCICIO = 1;
    private static final Integer UPDATED_EJERCICIO = 2;

    private static final Double DEFAULT_IMPORTE_TOTAL = 1D;
    private static final Double UPDATED_IMPORTE_TOTAL = 2D;

    private static final Boolean DEFAULT_PAGADO = false;
    private static final Boolean UPDATED_PAGADO = true;

    private static final Concepto DEFAULT_CONCEPTO = Concepto.Fianza;
    private static final Concepto UPDATED_CONCEPTO = Concepto.Alquiler;

    private static final String ENTITY_API_URL = "/api/cargos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCargoMockMvc;

    private Cargo cargo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cargo createEntity(EntityManager em) {
        Cargo cargo = new Cargo()
            .fechaCargo(DEFAULT_FECHA_CARGO)
            .mes(DEFAULT_MES)
            .ejercicio(DEFAULT_EJERCICIO)
            .importeTotal(DEFAULT_IMPORTE_TOTAL)
            .pagado(DEFAULT_PAGADO)
            .concepto(DEFAULT_CONCEPTO);
        return cargo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cargo createUpdatedEntity(EntityManager em) {
        Cargo cargo = new Cargo()
            .fechaCargo(UPDATED_FECHA_CARGO)
            .mes(UPDATED_MES)
            .ejercicio(UPDATED_EJERCICIO)
            .importeTotal(UPDATED_IMPORTE_TOTAL)
            .pagado(UPDATED_PAGADO)
            .concepto(UPDATED_CONCEPTO);
        return cargo;
    }

    @BeforeEach
    public void initTest() {
        cargo = createEntity(em);
    }

    @Test
    @Transactional
    void createCargo() throws Exception {
        int databaseSizeBeforeCreate = cargoRepository.findAll().size();
        // Create the Cargo
        restCargoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cargo)))
            .andExpect(status().isCreated());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeCreate + 1);
        Cargo testCargo = cargoList.get(cargoList.size() - 1);
        assertThat(testCargo.getFechaCargo()).isEqualTo(DEFAULT_FECHA_CARGO);
        assertThat(testCargo.getMes()).isEqualTo(DEFAULT_MES);
        assertThat(testCargo.getEjercicio()).isEqualTo(DEFAULT_EJERCICIO);
        assertThat(testCargo.getImporteTotal()).isEqualTo(DEFAULT_IMPORTE_TOTAL);
        assertThat(testCargo.getPagado()).isEqualTo(DEFAULT_PAGADO);
        assertThat(testCargo.getConcepto()).isEqualTo(DEFAULT_CONCEPTO);
    }

    @Test
    @Transactional
    void createCargoWithExistingId() throws Exception {
        // Create the Cargo with an existing ID
        cargo.setId(1L);

        int databaseSizeBeforeCreate = cargoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCargoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cargo)))
            .andExpect(status().isBadRequest());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCargos() throws Exception {
        // Initialize the database
        cargoRepository.saveAndFlush(cargo);

        // Get all the cargoList
        restCargoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cargo.getId().intValue())))
            .andExpect(jsonPath("$.[*].fechaCargo").value(hasItem(DEFAULT_FECHA_CARGO.toString())))
            .andExpect(jsonPath("$.[*].mes").value(hasItem(DEFAULT_MES.toString())))
            .andExpect(jsonPath("$.[*].ejercicio").value(hasItem(DEFAULT_EJERCICIO)))
            .andExpect(jsonPath("$.[*].importeTotal").value(hasItem(DEFAULT_IMPORTE_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].pagado").value(hasItem(DEFAULT_PAGADO.booleanValue())))
            .andExpect(jsonPath("$.[*].concepto").value(hasItem(DEFAULT_CONCEPTO.toString())));
    }

    @Test
    @Transactional
    void getCargo() throws Exception {
        // Initialize the database
        cargoRepository.saveAndFlush(cargo);

        // Get the cargo
        restCargoMockMvc
            .perform(get(ENTITY_API_URL_ID, cargo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cargo.getId().intValue()))
            .andExpect(jsonPath("$.fechaCargo").value(DEFAULT_FECHA_CARGO.toString()))
            .andExpect(jsonPath("$.mes").value(DEFAULT_MES.toString()))
            .andExpect(jsonPath("$.ejercicio").value(DEFAULT_EJERCICIO))
            .andExpect(jsonPath("$.importeTotal").value(DEFAULT_IMPORTE_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.pagado").value(DEFAULT_PAGADO.booleanValue()))
            .andExpect(jsonPath("$.concepto").value(DEFAULT_CONCEPTO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCargo() throws Exception {
        // Get the cargo
        restCargoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCargo() throws Exception {
        // Initialize the database
        cargoRepository.saveAndFlush(cargo);

        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();

        // Update the cargo
        Cargo updatedCargo = cargoRepository.findById(cargo.getId()).get();
        // Disconnect from session so that the updates on updatedCargo are not directly saved in db
        em.detach(updatedCargo);
        updatedCargo
            .fechaCargo(UPDATED_FECHA_CARGO)
            .mes(UPDATED_MES)
            .ejercicio(UPDATED_EJERCICIO)
            .importeTotal(UPDATED_IMPORTE_TOTAL)
            .pagado(UPDATED_PAGADO)
            .concepto(UPDATED_CONCEPTO);

        restCargoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCargo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCargo))
            )
            .andExpect(status().isOk());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
        Cargo testCargo = cargoList.get(cargoList.size() - 1);
        assertThat(testCargo.getFechaCargo()).isEqualTo(UPDATED_FECHA_CARGO);
        assertThat(testCargo.getMes()).isEqualTo(UPDATED_MES);
        assertThat(testCargo.getEjercicio()).isEqualTo(UPDATED_EJERCICIO);
        assertThat(testCargo.getImporteTotal()).isEqualTo(UPDATED_IMPORTE_TOTAL);
        assertThat(testCargo.getPagado()).isEqualTo(UPDATED_PAGADO);
        assertThat(testCargo.getConcepto()).isEqualTo(UPDATED_CONCEPTO);
    }

    @Test
    @Transactional
    void putNonExistingCargo() throws Exception {
        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();
        cargo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCargoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cargo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cargo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCargo() throws Exception {
        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();
        cargo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCargoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cargo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCargo() throws Exception {
        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();
        cargo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCargoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cargo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCargoWithPatch() throws Exception {
        // Initialize the database
        cargoRepository.saveAndFlush(cargo);

        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();

        // Update the cargo using partial update
        Cargo partialUpdatedCargo = new Cargo();
        partialUpdatedCargo.setId(cargo.getId());

        partialUpdatedCargo.mes(UPDATED_MES).ejercicio(UPDATED_EJERCICIO).importeTotal(UPDATED_IMPORTE_TOTAL).pagado(UPDATED_PAGADO);

        restCargoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCargo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCargo))
            )
            .andExpect(status().isOk());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
        Cargo testCargo = cargoList.get(cargoList.size() - 1);
        assertThat(testCargo.getFechaCargo()).isEqualTo(DEFAULT_FECHA_CARGO);
        assertThat(testCargo.getMes()).isEqualTo(UPDATED_MES);
        assertThat(testCargo.getEjercicio()).isEqualTo(UPDATED_EJERCICIO);
        assertThat(testCargo.getImporteTotal()).isEqualTo(UPDATED_IMPORTE_TOTAL);
        assertThat(testCargo.getPagado()).isEqualTo(UPDATED_PAGADO);
        assertThat(testCargo.getConcepto()).isEqualTo(DEFAULT_CONCEPTO);
    }

    @Test
    @Transactional
    void fullUpdateCargoWithPatch() throws Exception {
        // Initialize the database
        cargoRepository.saveAndFlush(cargo);

        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();

        // Update the cargo using partial update
        Cargo partialUpdatedCargo = new Cargo();
        partialUpdatedCargo.setId(cargo.getId());

        partialUpdatedCargo
            .fechaCargo(UPDATED_FECHA_CARGO)
            .mes(UPDATED_MES)
            .ejercicio(UPDATED_EJERCICIO)
            .importeTotal(UPDATED_IMPORTE_TOTAL)
            .pagado(UPDATED_PAGADO)
            .concepto(UPDATED_CONCEPTO);

        restCargoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCargo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCargo))
            )
            .andExpect(status().isOk());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
        Cargo testCargo = cargoList.get(cargoList.size() - 1);
        assertThat(testCargo.getFechaCargo()).isEqualTo(UPDATED_FECHA_CARGO);
        assertThat(testCargo.getMes()).isEqualTo(UPDATED_MES);
        assertThat(testCargo.getEjercicio()).isEqualTo(UPDATED_EJERCICIO);
        assertThat(testCargo.getImporteTotal()).isEqualTo(UPDATED_IMPORTE_TOTAL);
        assertThat(testCargo.getPagado()).isEqualTo(UPDATED_PAGADO);
        assertThat(testCargo.getConcepto()).isEqualTo(UPDATED_CONCEPTO);
    }

    @Test
    @Transactional
    void patchNonExistingCargo() throws Exception {
        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();
        cargo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCargoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cargo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cargo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCargo() throws Exception {
        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();
        cargo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCargoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cargo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCargo() throws Exception {
        int databaseSizeBeforeUpdate = cargoRepository.findAll().size();
        cargo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCargoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cargo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cargo in the database
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCargo() throws Exception {
        // Initialize the database
        cargoRepository.saveAndFlush(cargo);

        int databaseSizeBeforeDelete = cargoRepository.findAll().size();

        // Delete the cargo
        restCargoMockMvc
            .perform(delete(ENTITY_API_URL_ID, cargo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cargo> cargoList = cargoRepository.findAll();
        assertThat(cargoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
