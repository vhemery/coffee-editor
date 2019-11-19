/*!
 * Copyright (C) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 */
import { ModelServerClient, ModelServerCommandUtil, ModelServerReferenceDescription } from '@modelserver/theia/lib/common';
import { ILogger } from '@theia/core/lib/common';
import URI from '@theia/core/lib/common/uri';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { inject, injectable } from 'inversify';
import {
  JsonFormsTreeEditorWidget,
  JsonFormsTreeEditorWidgetOptions,
} from 'jsonforms-tree-extension/lib/browser/editor/json-forms-tree-editor-widget';
import { JSONFormsWidget } from 'jsonforms-tree-extension/lib/browser/editor/json-forms-widget';
import { JsonFormsTree } from 'jsonforms-tree-extension/lib/browser/tree/json-forms-tree';
import { AddCommandProperty, JsonFormsTreeWidget } from 'jsonforms-tree-extension/lib/browser/tree/json-forms-tree-widget';

@injectable()
export class CoffeeTreeEditorWidget extends JsonFormsTreeEditorWidget {
  constructor(
    @inject(JsonFormsTreeEditorWidgetOptions)
    readonly options: JsonFormsTreeEditorWidgetOptions,
    @inject(JsonFormsTreeWidget)
    readonly treeWidget: JsonFormsTreeWidget,
    @inject(JSONFormsWidget)
    readonly formWidget: JSONFormsWidget,
    @inject(WorkspaceService)
    readonly workspaceService: WorkspaceService,
    @inject(ILogger) readonly logger: ILogger,
    @inject(ModelServerClient)
    private readonly modelServerApi: ModelServerClient) {
    super(
      options,
      treeWidget,
      formWidget,
      workspaceService,
      logger,
      CoffeeTreeEditorWidget.WIDGET_ID
    );
  }

  protected handleFormUpdate(data: any, node: ModelServerReferenceDescription): void {
    throw new Error('Method not implemented.');
  }

  public uri(): URI {
    return this.options.uri;
  }

  public save(): void {
    this.logger.info('Save data to server');
    this.modelServerApi.save(this.getModelIDToRequest());
  }

  protected deleteNode(node: Readonly<JsonFormsTree.Node>): void {
    const removeCommand = ModelServerCommandUtil.createRemoveCommand(
      this.getNodeDescription(node.parent as JsonFormsTree.Node),
      node.jsonforms.property,
      node.jsonforms.index ? [Number(node.jsonforms.index)] : []
    );
    this.modelServerApi.edit(this.getModelIDToRequest(), removeCommand);
  }

  protected addNode({ node, eClass, property }: AddCommandProperty): void {
    const addCommand = ModelServerCommandUtil.createAddCommand(
      this.getNodeDescription(node),
      property,
      [{ eClass }]
    );
    this.modelServerApi.edit(this.getModelIDToRequest(), addCommand);
  }

  dispose() {
    super.dispose();
  }
}
export namespace CoffeeTreeEditorWidget {
  export const WIDGET_ID = 'json-forms-tree-editor';
}
