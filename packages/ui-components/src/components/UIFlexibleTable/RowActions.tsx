import React from 'react';
import { UIFlexibleTableRowActionButton } from './UIFlexibleTableRowActionButton';
import type { UIFlexibleTableProps, TableRowEventHandlerParameters } from './types';
import { UiIcons, UIVerticalDivider } from '..';

export interface RowActionsProps<T> {
    rowIndex: number;
    onMoveDownClick?: () => void;
    onMoveUpClick?: () => void;
    onFocusRowAction: (name: string) => void;
    tableProps: UIFlexibleTableProps<T>;
}

/**
 * RowActions component.
 *
 * @param {RowActionsProps<T>} props
 * @returns {React.ReactElement}
 */
export function RowActions<T>(props: RowActionsProps<T>): React.ReactElement {
    const { rowIndex, tableProps } = props;
    const rows = props.tableProps.rows;
    const rowKey = rows[rowIndex].key;
    const cells = rows[rowIndex].cells;
    const upArrowDisabled = rowIndex <= 0;
    const downArrowDisabled = rowIndex >= rows.length - 1;
    const isShowReorderButtons = !tableProps.readonly && tableProps.onTableReorder;
    const additionalActions: React.ReactNode[] = [];
    const isShowDeleteAction = tableProps.onDeleteRow && !tableProps.readonly;

    const divider = <UIVerticalDivider className="flexible-table-content-table-row-item-actions-divider" />;

    if (tableProps.onRenderActions) {
        const customActions = tableProps.onRenderActions({ rowIndex, rowKey, cells, readonly: !!tableProps.readonly });
        additionalActions.push(
            ...customActions.map((actionElement, idx) => {
                return (
                    <React.Fragment key={`action-${actionElement.key}`}>
                        <div className="flexible-table-content-table-row-item-actions-item-wrapper">
                            {actionElement}
                        </div>

                        {idx < customActions.length - 1 && divider}
                    </React.Fragment>
                );
            })
        );
    }

    const reorderButtons = isShowReorderButtons && (
        <div className="flexible-table-content-table-row-item-actions-item-wrapper">
            {/* Up Arrow */}
            <UIFlexibleTableRowActionButton
                key="up-action"
                actionName="up"
                disabled={upArrowDisabled || tableProps.isContentLoading}
                iconName={UiIcons.ArrowUp}
                rowNumber={rowIndex}
                tableId={tableProps.id}
                onClick={props.onMoveUpClick}
                onFocus={(): void => {
                    props.onFocusRowAction('up');
                }}
            />

            {/* Down Arrow */}
            <UIFlexibleTableRowActionButton
                key="down-action"
                actionName="down"
                disabled={downArrowDisabled || tableProps.isContentLoading}
                iconName={UiIcons.ArrowDown}
                rowNumber={rowIndex}
                tableId={tableProps.id}
                onClick={props.onMoveDownClick}
                onFocus={(): void => {
                    props.onFocusRowAction('down');
                }}
            />
        </div>
    );

    const deleteRowAction = isShowDeleteAction && (
        <div className="flexible-table-content-table-row-item-actions-item-wrapper">
            {getDeleteRowAction(tableProps, { rowIndex, rowKey, cells, readonly: false })}
        </div>
    );

    return (
        <React.Fragment>
            {additionalActions}
            {additionalActions.length > 0 && (isShowReorderButtons || isShowDeleteAction) && divider}
            {reorderButtons}
            {isShowReorderButtons && isShowDeleteAction && divider}
            {deleteRowAction}
        </React.Fragment>
    );
}

/**
 * Get delete row action.
 *
 * @param {UIFlexibleTableProps<T>} props
 * @param {TableRowEventHandlerParameters<T>} params
 * @returns {React.ReactNode}
 */
function getDeleteRowAction<T>(props: UIFlexibleTableProps<T>, params: TableRowEventHandlerParameters<T>) {
    const { isDeleteDisabled } = props.onRenderDeleteAction
        ? props.onRenderDeleteAction(params)
        : { isDeleteDisabled: false };
    return (
        <UIFlexibleTableRowActionButton
            key="delete-action"
            actionName="delete"
            iconName={UiIcons.TrashCan}
            disabled={!!isDeleteDisabled || props.isContentLoading}
            rowNumber={params.rowIndex}
            onClick={(): void => {
                if (props.onDeleteRow) {
                    props.onDeleteRow(params);
                }
            }}
            tableId={props.id}
        />
    );
}
