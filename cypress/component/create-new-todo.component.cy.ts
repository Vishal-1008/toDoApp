import { CreateNewTodoComponent } from '../../src/app/components/create-new-todo/create-new-todo.component';
import { mount } from 'cypress/angular';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../src/app/components/date-picker/date-picker.component';
import { RecentComponent } from '../../src/app/components/recent/recent.component';

describe('CreateNewTodoComponent', () => {
 beforeEach(() => {
  localStorage.clear();
  mount(CreateNewTodoComponent, {
    imports: [CommonModule, DatePickerComponent, RecentComponent],
  }).then((componentFixture) => {
    (window as any).component = componentFixture.component;
  });
});


it('should create a todo list when title is provided', () => {
  cy.window().its('component').then((comp) => {
    comp.selDate = new Date();
    comp.addTitle('My Todo');
  });

  cy.window().its('component.todoLists').should('have.length', 1);
  cy.window().its('component.todoLists.0.title').should('eq', 'My Todo');
});


  it('should not add more than 3 todo lists', () => {
    cy.window().then(win => {
      const comp = (win as any).component;
      comp.selDate = new Date();
      comp.addTitle('List 1');
      comp.addTitle('List 2');
      comp.addTitle('List 3');
      comp.addTitle('List 4');
    });

    cy.window().its('component.todoLists').should('have.length', 3);
    cy.window().its('component.errorStatus').should('be.true');
    cy.window().its('component.errorMsg')
      .should('include', 'Cannot create more than 3 todo lists');
  });

    it('should not add a todo list without a title', () => {
      cy.window();
    });

    it('Error message should be displayed when trying to add a todo list without a title', () => {
      cy.window().then(win => {
        const comp = (win as any).component;
        comp.selDate = new Date();
        comp.addTitle('');
      });

      cy.window().its('component.errorStatus').should('be.true');
      cy.window().its('component.errorMsg')
        .should('include', 'Cannot create list without title. Enter list title and try again.');
    });
  });
