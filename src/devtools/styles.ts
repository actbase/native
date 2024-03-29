import { StyleSheet } from 'react-native';

import { BUBBLE_SIZE } from './common';

const styles = StyleSheet.create({
  bubble: {
    zIndex: 10,
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bubbleItem: {
    width: BUBBLE_SIZE - 4,
    height: BUBBLE_SIZE - 4,
    borderRadius: (BUBBLE_SIZE - 4) / 2,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bubbleItemActive: {
    borderColor: '#76c29b',
  },
  bubbleDesc: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleDescItem: {
    backgroundColor: '#eee',
    paddingHorizontal: 4,
    borderRadius: 1,
  },
  bubbleDescText: {
    fontSize: 8,
    lineHeight: 12,
    height: 12,
  },
  screen: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerTitle: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  footerUri: { fontSize: 10, color: '#777' },

  noItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noItemText: { fontSize: 12, color: '#777' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 25,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
  clearButton: {
    backgroundColor: '#db2929',
    paddingHorizontal: 5,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  clearButtonText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  networkItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  networkItemTag: {
    width: 40,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  consoleItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  consoleItemTag: {
    backgroundColor: '#89bf04',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  consoleItemTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  systemSectionHeader: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 8,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  systemSectionBadge: {
    backgroundColor: '#aaa',
    borderRadius: 2,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  systemSectionItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 40,
    alignItems: 'center',
  },
  systemSectionItemFoot: { paddingVertical: 2, justifyContent: 'space-between', alignItems: 'center' },
  navigationItem: {
    flexDirection: 'row',
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  navigationText: {
    flex: 1,
    fontSize: 14,
  },
  navigationChild: { paddingLeft: 10, backgroundColor: '#eee' },
});

export default styles;
