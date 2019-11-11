import {IAppState} from '../interfaces/appState.interface';
import {
  CHANGE_ACTIVE_CATEGORY,
  CHANGE_ADMIN_LOGGEDIN,
  CHANGE_CATEGORIES,
  CHANGE_CONVERSATIONS,
  CHANGE_LESSONS,
  CHANGE_POPUP_CONTENT, CHANGE_PRESENT_CATEGORY, CHANGE_PRESENT_LESSON, CHANGE_PRESENT_SUBJECT, CHANGE_PRESENT_TOPIC,
  CHANGE_ROUTE,
  CHANGE_SUBJECTS,
  CHANGE_TOPICS,
  REMOVE_CATEGORIES,
  REMOVE_CONVERSATIONS,
  REMOVE_LESSONS,
  REMOVE_SUBJECTS,
  REMOVE_TOPICS,
  UPDATE_CATEGORIES,
  UPDATE_CONVERSATIONS,
  UPDATE_LESSONS,
  UPDATE_SUBJECTS,
  UPDATE_TOPICS
} from './actions';
import {removeItem, updateArray} from '../utilities/functions';

export const INITIAL_STATE: IAppState = {
  route: '',
  isAdminLoggedIn: false,
  popupContent: {
    title: '',
    button: '',
    placeholder: '',
    content: ''
  },
  categories: [],
  activeCategory: {},
  activeSubject: {},
  activeTopic: {},
  activeLesson: {},
  subjects: [],
  topics: [],
  lessons: [],
  conversations: []
};

export function reducerApp(state, action) {
  switch (action.type) {
    case CHANGE_ROUTE:
      return Object.assign({}, state, {
        route: action.route
      });
    case CHANGE_ADMIN_LOGGEDIN:
      return Object.assign({}, state, {
        isAdminLoggedIn: action.isAdminLoggedIn
      });
    case CHANGE_POPUP_CONTENT:
      return Object.assign({}, state, {
        popupContent: action.popupContent
      });
    case CHANGE_CATEGORIES:
      return Object.assign({}, state, {
        categories: action.categories
      });
    case UPDATE_CATEGORIES:
      return Object.assign({}, state, {
        categories: updateArray(state.categories, action.category)
      });
    case REMOVE_CATEGORIES:
      return Object.assign({}, state, {
        categories: removeItem(state.categories, action.category)
      });
    case CHANGE_SUBJECTS:
      return Object.assign({}, state, {
        subjects: action.subjects
      });
    case UPDATE_SUBJECTS:
      return Object.assign({}, state, {
        subjects: updateArray(state.subjects, action.subject)
      });
    case REMOVE_SUBJECTS:
      return Object.assign({}, state, {
        subjects: removeItem(state.subjects, action.subject)
      });
    case CHANGE_TOPICS:
      return Object.assign({}, state, {
        topics: action.topics
      });
    case UPDATE_TOPICS:
      return Object.assign({}, state, {
        topics: updateArray(state.topics, action.topic)
      });
    case REMOVE_TOPICS:
      return Object.assign({}, state, {
        topics: removeItem(state.topics, action.topic)
      });
    case CHANGE_LESSONS:
      return Object.assign({}, state, {
        lessons: action.lessons
      });
    case UPDATE_LESSONS:
      return Object.assign({}, state, {
        lessons: updateArray(state.lessons, action.lesson)
      });
    case REMOVE_LESSONS:
      return Object.assign({}, state, {
        lessons: removeItem(state.lessons, action.lesson)
      });
    case CHANGE_CONVERSATIONS:
      return Object.assign({}, state, {
        conversations: action.conversations
      });
    case UPDATE_CONVERSATIONS:
      return Object.assign({}, state, {
        conversations: updateArray(state.conversations, action.conversation)
      });
    case REMOVE_CONVERSATIONS:
      return Object.assign({}, state, {
        conversations: removeItem(state.conversations, action.conversation)
      });
    case CHANGE_PRESENT_CATEGORY:
      return Object.assign({}, state, {
        activeCategory: action.activeCategory
      });
    case CHANGE_PRESENT_SUBJECT:
      return Object.assign({}, state, {
        activeSubject: action.activeSubject
      });
    case CHANGE_PRESENT_TOPIC:
      return Object.assign({}, state, {
        activeTopic: action.activeTopic
      });
    case CHANGE_PRESENT_LESSON:
      return Object.assign({}, state, {
        activeLesson: action.activeLesson
      });
  }
  return state;
}
