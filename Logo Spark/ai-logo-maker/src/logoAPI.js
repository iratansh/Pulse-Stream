// This is an implementation of SSE for logo generation

export function streamLogos(taskId, companyName, onLogoGenerated, onComplete, onError, onAbort) {
    // EventSource controller
    let abortSent = false;
    
    const controller = { 
      isActive: true, 
      userInitiatedAbort: false, 
      eventSource: null, 
      abort: async () => {
        // Prevent multiple aborts for the same task
        if (abortSent) {
          console.log('Abort already sent for this task, ignoring duplicate request');
          return;
        }
        
        abortSent = true;
        console.log('Abort requested for task:', taskId);
        controller.userInitiatedAbort = true;
        controller.isActive = false;
        
        try {
          // Close the event source before sending the abort request
          if (controller.eventSource) {
            console.log('Closing event source before abort request');
            controller.eventSource.close();
            controller.eventSource = null;
          }
          
          console.log(`Sending abort request to server for task ${taskId}`);
          const res = await fetch(`http://localhost:5080/api/abort-generation/${taskId}`, { 
            method: 'DELETE' 
          });
          
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          
          const data = await res.json();
          console.log('Abort response:', data);
          if (onAbort && data.status === 'success') onAbort(data);
        } catch (err) {
          console.error('Error during abort:', err);
          if (onAbort) onAbort({ 
            status: 'aborted', 
            message: err.message, 
            total_generated: 0 
          });
        }
      }
    };
  
    // Open SSE connection
    const url = `http://localhost:5080/api/stream-logos/${taskId}?company_name=${encodeURIComponent(companyName)}`;
    console.log(`Opening EventSource connection to: ${url}`);
    controller.eventSource = new EventSource(url);
  
    controller.eventSource.onopen = () => console.log('SSE connection opened for task:', taskId);
    
    controller.eventSource.onerror = (err) => {
      console.error('SSE error for task:', taskId, err);
      if (controller.isActive) {
        controller.isActive = false;
        if (controller.eventSource) {
          controller.eventSource.close();
          controller.eventSource = null;
        }
        if (!controller.userInitiatedAbort && onError) {
          onError(new Error('Stream connection failed'));
        }
      }
    };
  
    controller.eventSource.onmessage = (event) => {
      if (!controller.isActive) return;
      
      try {
        const data = JSON.parse(event.data);
        console.log('Received logo data:', data);
        
        // Convert index to number if it exists
        if (data.index !== undefined) {
          data.index = Number(data.index);
        }
        
        if (data.status === 'success' && data.logo) {
          onLogoGenerated(data);
        } else if (data.status === 'aborted') {
          if (controller.eventSource) {
            controller.eventSource.close();
            controller.eventSource = null;
          }
          if (onAbort && !controller.userInitiatedAbort) {
            onAbort(data);
          }
        } else if (data.status === 'error') {
          if (controller.eventSource) {
            controller.eventSource.close();
            controller.eventSource = null;
          }
          if (onError) {
            onError(new Error(data.message));
          }
        }
      } catch (err) {
        console.error('Error processing event data:', err);
        if (onError) onError(err);
      }
    };
  
    // Handle done event
    controller.eventSource.addEventListener('done', () => {
      console.log('Done event received, closing connection');
      if (controller.eventSource) {
        controller.eventSource.close();
        controller.eventSource = null;
        controller.isActive = false;
      }
      if (onComplete) onComplete();
    });
  
    return controller;
}