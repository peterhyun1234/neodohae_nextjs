import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Image from 'next/image';
import styled from 'styled-components';

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

const Column = ({ column, items }: any) => {
  const isEmpty = column.itemIds.length === 0;
  const isDoing = column.id === 'doing';
  const isDone = column.id === 'done';
  return (
    <Droppable droppableId={String(column.id)} key={`column-${column.id}`}>
      {(provided: any, snapshot: any) => (
        <List
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
        >
          <ColumnTitle>{column.title}</ColumnTitle>
          {isEmpty && (
            <EmptyColumn>{'Drag and Drop으로 일정을 추가'}</EmptyColumn>
          )}
          {items.map((item: any, index: number) => (
            <Draggable
              key={`item-${item.id}`}
              draggableId={String(item.id)}
              index={index}
            >
              {(provided: any) => (
                <Item
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <ItemTitleDiv>
                    <ItemTitleIconDiv isDone={isDone}>
                      {isDone ? (
                        <CheckCircleRoundedIcon
                          color="inherit"
                          fontSize="inherit"
                        />
                      ) : (
                        <>
                          {isDoing ? (
                            <AutorenewRoundedIcon
                              color="inherit"
                              fontSize="inherit"
                            />
                          ) : (
                            <CheckCircleOutlineRoundedIcon
                              color="inherit"
                              fontSize="inherit"
                            />
                          )}
                        </>
                      )}
                    </ItemTitleIconDiv>
                    <ItemTitle isDone={isDone} isDoing={isDoing}>{item.title}</ItemTitle>
                  </ItemTitleDiv>
                  <ItemDescription>{item.description}</ItemDescription>
                  <ItemUsersDiv>
                    {item.assignedUsers.map((user: any, index: number) => {
                      return (
                        <>
                          {user !== undefined && user !== null && (
                            <ItemUserDiv key={index}>
                              <ProfileImg
                                loader={() => user.picture}
                                bordercolor={
                                  user.color !== null &&
                                  user.color !== undefined
                                    ? user.color
                                    : '#fff'
                                }
                                src={user.picture}
                                alt="roommate's picture"
                                width={25}
                                height={25}
                              />
                              <UserName>{user?.username}</UserName>
                            </ItemUserDiv>
                          )}
                        </>
                      );
                    })}
                  </ItemUsersDiv>
                  <ItemDateDiv>
                    {new Date(item.startTime).toLocaleDateString('ko-KR')} ~{' '}
                    {new Date(item.endTime).toLocaleDateString('ko-KR')}
                  </ItemDateDiv>
                </Item>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  );
};

interface Props {
  events: any;
  todoStatusUpdate: any;
}

const TodoKanbanBoard = ({ events, todoStatusUpdate }: Props) => {
  const columnsFromBackend = {
    ['todo']: {
      id: 'todo',
      title: 'To-do',
      itemIds: [],
    },
    ['doing']: {
      id: 'doing',
      title: 'Doing',
      itemIds: [],
    },
    ['done']: {
      id: 'done',
      title: 'Done',
      itemIds: [],
    },
  };

  const [columns, setColumns] = useState<any>(columnsFromBackend);
  const [items, setItems] = useState<any>({});

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.itemIds];
      const destItems = [...destColumn.itemIds];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          itemIds: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          itemIds: destItems,
        },
      });

      todoStatusUpdate(removed, destination.droppableId.toUpperCase());
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.itemIds];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          itemIds: copiedItems,
        },
      });
    }
  };

  useEffect(() => {
    const newItems: any = {};
    const newColumns: any = { ...columnsFromBackend };
    events.forEach((event: any) => {
      newItems[event.id] = event;
      newColumns[event.status.toLowerCase()].itemIds.push(event.id);
    });
    setItems(newItems);
    setColumns(newColumns);
  }, [events]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {Object.values(columns).map((column: any) => (
          <Column
            key={column.id}
            column={column}
            items={column.itemIds.map((itemId: any) => items[itemId])}
          />
        ))}
      </Container>
    </DragDropContext>
  );
};

const List = styled.div<{ isDraggingOver: boolean }>`
  min-width: 220px;
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isDraggingOver ? '#d2d0ff' : 'transparent'};
  border-radius: 15px;

  @media (min-width: 660px) {
    width: calc(100% / 3);
  }
`;
const ColumnTitle = styled.div`
  padding-bottom: 20px;
  color: #364a6d;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
`;
const Container = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
`;
const EmptyColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #858585;
  text-align: center;
  font-size: 15px;
`;
const Item = styled.div`
  padding: 10px;
  margin-bottom: 12px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 2px;
`;
const ItemTitleDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
`;
const ItemTitleIconDiv = styled.div<{ isDone: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  color: ${(props) => (props.isDone ? '#58C6CD' : '#858585')};
  font-size: 20px;

  @media (max-width: 650px) {
    font-size: 15px;
  }
`;
const ItemTitle = styled.div<{ isDone?: boolean, isDoing?: boolean }>`
  text-align: left;
  font-size: 17px;
  font-weight: bold;
  color: #252525;
  line-height: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  box-shadow: ${(props) => (props.isDone ? 'rgba(88, 198, 205, 0.7) 0px -4px 0px inset' : props.isDoing ? 'rgba(133, 133, 133, 0.4) 0px -4px 0px inset' : 'initial')};
  @media (max-width: 650px) {
    font-size: 15px;
  }
`;
const ItemDescription = styled.div`
  text-align: left;
  font-size: 15px;
  color: #5f5f5f;
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  @media (max-width: 650px) {
    font-size: 13px;
  }
`;
const ItemUsersDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
  gap: 5px;
  margin-bottom: 10px;
`;
const ItemUserDiv = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`;
const ProfileImg = styled(Image)<{ bordercolor: string }>`
  height: 25px;
  width: 25px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 2px ${(props) => props.bordercolor};
  display: inline-block;
`;
const UserName = styled.div`
  width: 100%;
  height: 26px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 8px;
  font-weight: bold;
  color: #858585;
`;
const ItemDateDiv = styled.div`
  text-align: right;
  font-size: 13px;
  font-weight: bold;
  color: #858585;
  @media (max-width: 650px) {
    font-size: 11px;
  }
`;

export default TodoKanbanBoard;
