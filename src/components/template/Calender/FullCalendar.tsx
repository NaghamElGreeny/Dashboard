import { DateSelectArg, EventApi, EventClickArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Modal } from '../../molecules';
import ShowAlert from '../../atoms/ShowAlert';

function FullCalendarCustom() {
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleWeekendsToggle = () => {
        setWeekendsVisible(!weekendsVisible);
    };

    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        let title = await ShowAlert('Add your new event ', '', true, 'Done', true);
        if (title !== null) {
            const calendarApi = selectInfo.view.calendar;
            calendarApi.unselect(); // clear date selection
            calendarApi.addEvent({
                id: createEventId(),
                start: selectInfo.startStr,
                title,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    };

    const handleEventClick = async (clickInfo: EventClickArg) => {
        let confirm = await ShowAlert(
            'Delete Event !',
            `Are you sure you want to delete the event '${clickInfo.event.title}'`,
            false,
            'Confirm',
            true,
            'warning'
        );
        if (confirm) {
            clickInfo.event.remove();
        }
    };

    const handleEvents = (events: EventApi[]) => {
        setCurrentEvents(events);
    };

    const renderEventContent = (eventContent: EventContentArg) => {
        return (
            <>
                <b>{eventContent.timeText}</b>
                <i>{eventContent.event.title}</i>
            </>
        );
    };

    return (
        <div className="demo-app">
            <div className="demo-app-main">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={weekendsVisible}
                    initialEvents={INITIAL_EVENTS}
                    select={handleDateSelect}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    eventsSet={handleEvents}
                />
            </div>
        </div>
    );
}

export default FullCalendarCustom;
