package com.tfg.inmobiliaria;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.tfg.inmobiliaria");

        noClasses()
            .that()
            .resideInAnyPackage("com.tfg.inmobiliaria.service..")
            .or()
            .resideInAnyPackage("com.tfg.inmobiliaria.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.tfg.inmobiliaria.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
